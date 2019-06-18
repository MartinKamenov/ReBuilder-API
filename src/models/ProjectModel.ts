import Project from "./contracts/Project";

export default class ProjectModel implements Project {
    constructor(
        public name: String,
        public username: String,
        public userId: String,
        public projectImageUrl: String,
    ) {}
}