import projectSavingDeploymentService from './projectSavingDeployment.service';
const exec = require('child-process-promise').exec;

const deploymentService = {
    deployProject: async (project) => {
        await projectSavingDeploymentService
        .saveDeploymentProject(project.id, project.name, project.components);
        const path = './deployments/' + project.id;
        try {
            const commands = [`cd ${path} && npm install && SET PORT=3100 && npm start`];
            commands.forEach(async (command) => {
                const { stdout } = await exec(command);
                // tslint:disable-next-line:no-console
                console.log(stdout);
            });
        } catch(error) {
            // tslint:disable-next-line:no-console
            return error;
        }
    },
};

export default deploymentService;
