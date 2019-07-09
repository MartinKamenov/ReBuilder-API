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
                { command: `git init`, shouldExecute: true },
                { command: `heroku create ${name}`, shouldExecute: true },
                { command: `git remote add origin ${herokuGitUrl}`, shouldExecute: true },
                { command: `git add . && git commit -m "Auto generated commit"`, shouldExecute: true },
                { command: `git push -u origin master`, shouldExecute: true }];

            // tslint:disable-next-line:prefer-for-of
            for(let i = 0; i < commands.length; i++) {
                const command = `cd ${path} && ${commands[i].command}`;
                console.log('executed ' + command);
                try {
                    await exec(command);
                } catch(er) {
                    console.log(er);
                }
                await sleep(10000);
            }

            return `https://${name}.herokuapp.com`;
        } catch(error) {
            // tslint:disable-next-line:no-console
            return error;
        }
    },
};

export default deploymentService;
