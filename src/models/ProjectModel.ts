import Project from "./contracts/Project";

export default class ProjectModel implements Project {
    constructor(
        private name: String,
        private username: String,
        private userId: String,
        private projectImageUrl: String,
    ) {}
}