import Route from '../contracts/Route';
import controller from "./project-controller";
import constants from "../../constants/constants";
import ProjectRepository from '../../models/repositories/ProjectRepository';
import { Application } from 'express';

const { Router } = require('express');
const passport = require('passport');

class ProjectRoute implements Route {
    constructor(private app: Application, private projectRepository: ProjectRepository) {}
    attach = () => {
        const router = new Router();
    
        router
            .get('/', async (req, res) => {
                const projects = await controller.getAllProjects(this.projectRepository);
                res.send(projects);
            });
    
        this.app.use('/projects', router);
    }
};

export default ProjectRoute;