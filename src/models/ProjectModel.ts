import Project from "./contracts/Project";

export default class ProjectModel implements Project {
    constructor(
        public name: string,
        public username: string,
        public userId: string,
        public projectImageUrl: string,
        public components: any[],
    ) {}
}
