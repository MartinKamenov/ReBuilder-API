import projectSavingDeploymentService from './projectSavingDeployment.service';
import Project from '../models/contracts/Project';
const exec = require('child-process-promise').exec;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const deploymentService = {
    deployProject: async (project: Project): Promise<string> => {
        await projectSavingDeploymentService
        .saveDeploymentProject(project.id, project.name, project.components);
        const path = './deployments/' + project.id;
        try {
            const name = project.name.toLowerCase().trim().replace(/\s/g, '-');
            const herokuGitUrl = 'https://git.heroku.com/' + name + '.git';
            const commands = [
                `git init`,
                `heroku create ${name}`,
                `git add . && git commit -m "Auto generated commit"`,
                `git push heroku master`];
            commands.forEach(async (command) => {
                await exec(command);
                // tslint:disable-next-line:no-console
                console.log('executed ' + command);
                await sleep(3000);
            });

            return `https://${name}.herokuapp.com`;
        } catch(error) {
            // tslint:disable-next-line:no-console
            return error;
        }
    },
};

export default deploymentService;
