import projectSavingDeploymentService from './projectSavingDeployment.service';
import Project from '../models/contracts/Project';
import DeploymentRepository from '../models/repositories/DeploymentRepository';
const uuid = require('uuid');
const exec = require('child-process-promise').exec;

const deploymentService = {
    deployProject: async (project: Project, deploymentRepository: DeploymentRepository): Promise<string> => {
        await projectSavingDeploymentService
        .saveDeploymentProject(project.name, project.pages, project.projectImageUrl,
            project.id);
        const deployments = await deploymentRepository.findDeploymentById(project.id);
        if(deployments.length !== 1) {
            return;
        }
        const deployment = deployments[0];

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
                deployment.log.push({
                    message: 'Executed ' + command,
                    id: uuid.v1(),
                    data: Date.now()
                });
                try {
                    await exec(command);
                } catch(er) {
                    console.log(er);
                }
            }

            const url = `https://${name}.herokuapp.com`;

            deployment.deployUrl = url;

            return url;
        } catch(error) {
            deployment.log.push({
                message: error.message,
                id: uuid.v1(),
                data: Date.now()
            });
            // tslint:disable-next-line:no-console
            return error;
        }
    },
};

export default deploymentService;
