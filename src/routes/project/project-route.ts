import Route from '../contracts/Route';
import controller from './project-controller';
import constants from '../../constants/constants';
import ProjectRepository from '../../models/repositories/ProjectRepository';
import RequestInterface from '../../models/server/RequestInterface';
import ResponseInteface from '../../models/server/ResponseInterface';
import UserRepository from '../../models/repositories/UserRepository';
import AuthenticatedRequest from '../auth/contracts/AuthentedRequest';
import ExpressApplication from '../../models/Application';
import DeploymentRepository from '../../models/repositories/DeploymentRepository';
const enableWs = require('express-ws');

const { Router } = require('express');

class ProjectRoute implements Route {
    constructor(
        private app: ExpressApplication,
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository,
        private deploymentRepository: DeploymentRepository) {}
    public attach = () => {
        const router = new Router();

        enableWs(this.app);

        this.app.ws('/:id/deployment/status', async (ws, req) => {
            const id = req.params.id;

            controller.addConnection(id, ws);
            ws.on('message', async (msg) => {
                controller.sendMessage(id, msg);
            });

            ws.on('close', () => {
                controller.removeConnection(id);
            });
        });

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
            })
            .get('/:id/deploy', async (req: AuthenticatedRequest, res: ResponseInteface) => {
                const result = await controller.getDeploymentInformation(
                    this.deploymentRepository,
                    req
                );
                res.status(constants.SUCCESS_STATUS_CODE).send(result);
            })
            .post('/:id/deploy', async (req: AuthenticatedRequest, res: ResponseInteface) => {
                const result = await controller.deployProject(
                    this.projectRepository,
                    this.deploymentRepository,
                    req
                );
                res.status(constants.SUCCESS_STATUS_CODE).send(result);
            });

        this.app.use('/projects', router);
    }
}

export default ProjectRoute;
