import projectSavingDeploymentService from './projectSavingDeployment.service';
import Project from '../models/contracts/Project';
const exec = require('child-process-promise').exec;

const deploymentService = {
    deployProject: async (project: Project): Promise<string> => {
        await projectSavingDeploymentService
        .saveDeploymentProject(project.id, project.name, project.components);
        const path = './deployments/' + project.id;
        try {
            const name = project.name.toLowerCase().trim().replace(/\s/g, '-');
            console.log(name);
            // const herokuGitUrl = 'https://git.heroku.com/' + name + '.git';
            const commands = [`cd ${path} && git init && heroku create ${name}`,
                `cd ${path} &&` +
                `git add . && git commit -m "Auto generated commit"`,
                `cd ${path} && git push heroku master`];
            await commands.forEach(async (command) => {
                await setTimeout(async () => {
                    const { stdout } = await exec(command);
                    // tslint:disable-next-line:no-console
                    console.log(stdout);
                }, 2000);
            });

            return `https://${name}.herokuapp.com`;
        } catch(error) {
            // tslint:disable-next-line:no-console
            return error;
        }
    },
};

export default deploymentService;
