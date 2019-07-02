import Route from '../contracts/Route';
import controller from './project-controller';
import constants from '../../constants/constants';
import ProjectRepository from '../../models/repositories/ProjectRepository';
import { Application } from 'express';
import RequestInterface from '../../models/server/RequestInterface';
import ResponseInteface from '../../models/server/ResponseInterface';
import UserRepository from '../../models/repositories/UserRepository';
import AuthenticatedRequest from '../auth/contracts/AuthentedRequest';

const { Router } = require('express');

class ProjectRoute implements Route {
    constructor(
        private app: Application,
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository) {}
    public attach = () => {
        const router = new Router();

        router
            .get('/', async (req: RequestInterface, res: ResponseInteface) => {
                const projects = await controller.getAllProjects(this.projectRepository);
                res.status(constants.SUCCESS_STATUS_CODE).send(projects);
            })
            .post('/new', async (req: AuthenticatedRequest, res: ResponseInteface) => {
                const project = await controller.createProject(
                    this.projectRepository,
                    this.userRepository,
                    req
                );
                res.status(constants.SUCCESS_STATUS_CODE).send(project);
            })
            .post('/:id', async (req: AuthenticatedRequest, res: ResponseInteface) => {
                const project = await controller.editProject(
                    this.projectRepository,
                    this.userRepository,
                    req
                );
                res.status(constants.SUCCESS_STATUS_CODE).send(project);
            });

        this.app.use('/projects', router);
    }
}

export default ProjectRoute;
