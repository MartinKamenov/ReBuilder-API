import Deployment from '../contracts/Deployment';
import Database from '../../database/Database';

export default class DeploymentRepository {
    constructor(private database: Database, private collectionName: string) {}
    getAllDeployments(): Promise<Deployment[]> {
        return this.database.showAll(this.collectionName);
    }

    addProject(deployment: Deployment): Promise<Deployment[]> {
        return this.database.insert(this.collectionName, deployment);
    }

    findDeploymentById(id: string): Promise<Deployment[]> {
        return this.database.find(this.collectionName, { id });
    }

    updateDeployment(id: string, newDeployment: Deployment): Promise<Deployment[]> {
        return this.database.update(this.collectionName, { id }, newDeployment);
    }
}
