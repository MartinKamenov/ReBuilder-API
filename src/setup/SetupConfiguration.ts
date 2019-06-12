export default class SetupConfiguration {
    constructor(port: String, listenCallback: Function) {
        this.port = port;
        this.listenCallback = listenCallback;
    }
    public port: String;
    public listenCallback: Function;
};
