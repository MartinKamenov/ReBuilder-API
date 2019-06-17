import User from "./contracts/User";
import Project from "./contracts/Project";

export default class UserModel implements User {
    constructor(
        public username: String,
        public password: String,
        public email: String,
        public imageUrl: String,
        public projects: Array<Project>
    ) {}
}