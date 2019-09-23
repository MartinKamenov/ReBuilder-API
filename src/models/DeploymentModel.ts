import Deployment, { Status } from './contracts/Deployment';

export default class DeploymentModel implements Deployment {
    constructor(
        public id: string,
        public name: string,
        public username: string,
        public userId: string,
        public status: Status,
        public log: any[],
        public deployUrl: string
    ) {}
}
