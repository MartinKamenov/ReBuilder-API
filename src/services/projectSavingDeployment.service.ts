import templatingService from './templating.service';
const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const fse = require('fs-extra');

const projectSavingDeploymentService = {
    saveDeploymentProject: async (name, pages, imageUrl, id) => {
        const templates = templatingService.getAllTemplates(name, pages, imageUrl);
        templates.forEach(async (templateObject) => {
            const filePath = 'deployments/' + id + '/' + templateObject.filePath;
            // tslint:disable-next-line:no-console
            await fse.outputFile(filePath, templateObject.template).catch(console.log);
        });
    }
};

export default projectSavingDeploymentService;
