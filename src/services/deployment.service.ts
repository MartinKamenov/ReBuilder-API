import projectSavingDeploymentService from './projectSavingDeployment.service';

const deploymentService = {
    deployProject: (project) => {
        projectSavingDeploymentService
        .saveDeploymentProject(project.name, project.components);
    }
};

export default deploymentService;
