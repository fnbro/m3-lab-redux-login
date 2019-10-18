import React, { Component } from 'react'
import { IWindow } from '../framework/IWindow';
import { IAction, ActionType } from '../framework/IAction';
import { IUser, IState } from '../state/appState';
import { reducerFunctions } from '../reducer/appReducer';
import axios from 'axios';
declare let window: IWindow;

export interface IUserAction extends IAction {
    user: IUser
}
export interface IErrorMessage extends IAction {
    errorMessage: string;
}

reducerFunctions[ActionType.login_error] = function (newState: IState, action: IErrorMessage) {
    newState.UI.waitingForResponse = false;
    newState.UI.login.errorMessage = action.errorMessage;
    return newState
}

reducerFunctions[ActionType.get_user] = function (newState: IState, action: IUserAction) {
    newState.BM.user = action.user;
    return newState;
}

reducerFunctions[ActionType.user_logged_in] = function (newState: IState, action: IUserAction) {
    newState.UI.waitingForResponse = false;
    newState.UI.loggedIn = true;
    newState.UI.login.errorMessage = "";
    return newState;
}

reducerFunctions[ActionType.user_logout] = function (newState: IState, action: IUserAction) {
    newState.UI.waitingForResponse = false;
    newState.UI.loggedIn = false;
    newState.BM.user = {lastname:"",firstname:"",username:"",password:""};
    return newState;
}

export default class Login extends Component {
    render() {
        if (window.CS.getUIState().loggedIn)
        return (
            <form onSubmit={this.handleLogout}>
                    
                    <input type="submit" value="Logout"  />
                </form>
        )
       else  return (

            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input type="username" placeholder="username" onChange={this.handleUsernameLogin} />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input type="password" placeholder="********" onChange={this.handlePasswordLogin} />
                    <input type="submit" value="Login" />
                </form>
            
            </div>
        )
    }

    handleUsernameLogin(event: any) {
        let user = window.CS.getBMState().user;
        user.username = event.target.value;
        const action: IUserAction = {
            type: ActionType.get_user,
            user: user
        }
        window.CS.clientAction(action);
    }
    handlePasswordLogin(event: any) {
        let user = window.CS.getBMState().user;
        user.password = event.target.value;
        const action: IUserAction = {
            type: ActionType.get_user,
            user: user
        }
        window.CS.clientAction(action);
    }
    handleSubmit(event: any) {
        event.preventDefault();
        const uiAction: IAction = {
            type: ActionType.server_called,
        }
        window.CS.clientAction(uiAction);
        console.log(window.CS.getDBServerURL())
        axios.post("http://localhost:8080/login", window.CS.getBMState().user)
            .then(res => {
                if (res.data.errorMessage) {
                    const uiAction: IErrorMessage = {
                        type: ActionType.login_error,
                        errorMessage: res.data.errorMessage
                    }
                    window.CS.clientAction(uiAction);
                } else {
                    const loggedinAction: IUserAction = {
                        type: ActionType.user_logged_in,
                        user: res.data as IUser
                    }
                    window.CS.clientAction(loggedinAction);
                }
            })
    }
    handleLogout(event: any) {
        let user = window.CS.getBMState().user;
        user.password = event.target.value;
        const action: IUserAction = {
            type: ActionType.user_logout,
            user: user
        }
        axios.get('http://localhost:8080/logout')
            .then(res => {
                window.CS.clientAction(action);
            });
    }
}

