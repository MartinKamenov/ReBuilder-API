export default class SetupConfiguration {
    constructor(public port: string, public host: string, public listenCallback: () => void) {}
}
