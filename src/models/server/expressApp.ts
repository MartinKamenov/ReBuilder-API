export default interface expressApp {
    get(route: string, callbackFunction: Function): Function;

    post(route: string, callbackFunction: Function): Function;

    put(route: string, callbackFunction: Function): Function;

    delete(route: string, callbackFunction: Function): Function;

    use: Function;

    listen: Function;
}