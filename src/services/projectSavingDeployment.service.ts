import templatingService from './templating.service';
const fs = require('fs');

const projectSavingDeploymentService = {
    saveDeploymentProject: (name, droppedComponents) => {
        const templates = templatingService.getAllTemplates(name, droppedComponents);
        templates.forEach((templateObject) => {
            fs.writeFile('../../deployments/' + name + '/' + templateObject.filePath,
                templateObject.template, (err) => {
                if(err) {
                    // tslint:disable-next-line:no-console
                    return console.log(err);
                }
            });
        });
    }
};

export default projectSavingDeploymentService;
