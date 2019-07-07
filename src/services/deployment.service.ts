import projectSavingDeploymentService from './projectSavingDeployment.service';
const exec = require('child-process-promise').exec;

const deploymentService = {
    deployProject: async (project) => {
        await projectSavingDeploymentService
        .saveDeploymentProject(project.id, project.name, project.components);
        const path = './deployments/' + project.id;
        try {
            const commands = [`npm install --prefix ${path}`,
            'SET PORT=3100',
            `npm start --prefix ${path}`];
            for(let i = 0; i < commands.length; i++) {
                const { stdout } = await exec(commands[i]);
                console.log(stdout);
            }
        } catch(error) {
            // tslint:disable-next-line:no-console
            console.log(error);
        }
    },
};

export default deploymentService;
