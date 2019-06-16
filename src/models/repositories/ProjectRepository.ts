import Project from "../Project";

export default class ProjectRepository {
    constructor(private database: Database, private collectionName: String) {}
    getAllProjects() {
        return this.database.showAll(this.collectionName);
    }

    addProject(user: Project) {
        return this.database.insert(this.collectionName, user);
    }

    findProjectById(id: String) {
        return this.database.find(this.collectionName, { id });
    }

    updateProject(id: String, newProject: Project) {
        return this.database.update(this.collectionName, { id }, newProject);
    }
};
