import Project from '../contracts/Project';
import Database from '../../database/Database';

export default class ProjectRepository {
    constructor(private database: Database, private collectionName: string) {}
    getAllProjects(): Promise<Project[]> {
        return this.database.showAll(this.collectionName);
    }

    addProject(user: Project): Promise<Project[]> {
        return this.database.insert(this.collectionName, user);
    }

    findProjectById(id: string): Promise<Project[]> {
        return this.database.find(this.collectionName, { id });
    }

    updateProject(id: string, newProject: Project): Promise<Project[]> {
        return this.database.update(this.collectionName, { id }, newProject);
    }
};
