import Route from '../contracts/Route';
import controller from "./project-controller";
import constants from "../../constants/constants";
import ProjectRepository from '../../models/repositories/ProjectRepository';

const { Router } = require('express');
const passport = require('passport');

class ProjectRoute implements Route {
    attach = (app, projectRepository: ProjectRepository) => {
        const router = new Router();
    
        router
            .get('/', (req, res) => {

            });
    
        app.use('/projects', router);
    }
};

export default ProjectRoute;