import Route from '../contracts/Route';
import controller from "./project-controller";
import constants from "../../constants/constants";
import ProjectRepository from '../../models/repositories/ProjectRepository';
import { Application } from 'express';
import RequestInterface from '../../models/server/RequestInterface';
import ResponseInteface from '../../models/server/ResponseInterface';
import UserRepository from '../../models/repositories/UserRepository';
import AuthenticatedRequest from '../auth/contracts/AuthentedRequest';

const { Router } = require('express');
const passport = require('passport');

class ProjectRoute implements Route {
    constructor(
        private app: Application,
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository) {}
    attach = () => {
        const router = new Router();

        router
            .get('/', async (req: RequestInterface, res: ResponseInteface) => {
                const projects = await controller.getAllProjects(this.projectRepository);
                res.status(constants.SUCCESS_STATUS_CODE).send(projects);
            })
            .post('/new', async (req: AuthenticatedRequest, res: ResponseInteface) => {
                const projects = await controller.createProject(
                    this.projectRepository,
                    this.userRepository,
                    req,
                );
                res.status(constants.SUCCESS_STATUS_CODE).send(projects);
            });

        this.app.use('/projects', router);
    }
};

export default ProjectRoute;