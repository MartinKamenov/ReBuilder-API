import projectSavingDeploymentService from './projectSavingDeployment.service';
import portService from './port.service';
const exec = require('child-process-promise').exec;

const deploymentService = {
    deployProject: async (project) => {
        await projectSavingDeploymentService
        .saveDeploymentProject(project.id, project.name, project.components);
        const path = './deployments/' + project.id;
        try {
            if(portService.hasPort(project.id)) {
                return portService.getPort(project.id);
            }

            const port = portService.getPort(project.id);
            const herokuGitUrl = 'https://git.heroku.com/' + project.name + '.git';
            const commands = [`cd ${path} && git init && heroku create ${project.name} && ` +
                `git remote add origin ${herokuGitUrl} && ` +
                `git add . && git commit -m "Bla" && git push -u origin master`];
            commands.forEach(async (command) => {
                const { stdout } = await exec(command);
                // tslint:disable-next-line:no-console
                console.log(stdout);
            });

            return port;
        } catch(error) {
            // tslint:disable-next-line:no-console
            return error;
        }
    },
};

export default deploymentService;
