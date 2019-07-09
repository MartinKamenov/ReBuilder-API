import templatingService from './templating.service';
const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const fse = require('fs-extra');

const projectSavingDeploymentService = {
    saveDeploymentProject: async (id, name, droppedComponents) => {
        const templates = templatingService.getAllTemplates(name, droppedComponents);
        templates.forEach(async (templateObject) => {
            const filePath = 'deployments/' + id + '/' + templateObject.filePath;
            // tslint:disable-next-line:no-console
            await fse.outputFile(filePath, templateObject.template).catch(console.log);
        });
    }
};

export default projectSavingDeploymentService;
