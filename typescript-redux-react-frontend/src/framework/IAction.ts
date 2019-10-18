export enum ActionType {
    INIT = "@@INIT",
    update_user = "update_user",
    get_user = "get_user",
    user_logged_in = "user_logged_in",
    user_logout = "user_logout",
    user_created = "user_created",
    login_error = "login_error",
    create_asset = "create_asset",
    update_asset = "update_asset",
    delete_asset = "delete_asset",
    render_test = "render_test",
    server_called = "server_called",
    add_assets_from_server = "add_assets_from_server" 
}
export interface IAction {
    type: ActionType;
}
