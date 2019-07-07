import projectSavingDeploymentService from './projectSavingDeployment.service';

const deploymentService = {
    deployProject: async (project) => {
        await projectSavingDeploymentService
        .saveDeploymentProject(project.id, project.name, project.components);
    }
};

export default deploymentService;
