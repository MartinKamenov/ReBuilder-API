export default interface expressApp {
    get(route: String, callbackFunction: Function): Function;

    post(route: String, callbackFunction: Function): Function;

    put(route: String, callbackFunction: Function): Function;

    delete(route: String, callbackFunction: Function): Function;

    use: Function;

    listen: Function;
}