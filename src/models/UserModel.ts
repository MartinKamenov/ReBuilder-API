import Project from "./contracts/Project";
import User from "./contracts/User";

export default class UserModel implements User {
    constructor(
        public id: String,
        public username: String,
        public password: String,
        public email: String,
        public imageUrl: String,
        public projects: Array<Project>
    ) {}
}