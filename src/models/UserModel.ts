import Project from './contracts/Project';
import User from './contracts/User';

export default class UserModel implements User {
    constructor(
        public id: string,
        public username: string,
        public password: string,
        public email: string,
        public imageUrl: string,
        public projects: Array<Project>
    ) {}
}