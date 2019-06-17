import Project from "../contracts/Project";
import Database from "../../database/Database";

export default class ProjectRepository {
    constructor(private database: Database, private collectionName: String) {}
    getAllProjects(): Promise<Project[]> {
        return this.database.showAll(this.collectionName);
    }

    addProject(user: Project): Promise<Project[]> {
        return this.database.insert(this.collectionName, user);
    }

    findProjectById(id: String): Promise<Project[]> {
        return this.database.find(this.collectionName, { id });
    }

    updateProject(id: String, newProject: Project): Promise<Project[]> {
        return this.database.update(this.collectionName, { id }, newProject);
    }
};
