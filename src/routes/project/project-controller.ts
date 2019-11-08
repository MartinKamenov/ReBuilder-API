import ProjectRepository from '../../models/repositories/ProjectRepository';
import UserRepository from '../../models/repositories/UserRepository';
import AuthenticatedRequest from '../auth/contracts/AuthentedRequest';

import constants from '../../constants/constants';
import ProjectModel from '../../models/ProjectModel';
import authenticationService from '../../services/authentication.service';
import deploymentService from '../../services/deployment.service';
import DeploymentRepository from '../../models/repositories/DeploymentRepository';
import Page from '../../models/contracts/Page';
import templatingService from '../../services/templating.service';

const uuid = require('uuid');
const connections = {};

const controller = {
    addConnection: (id, connection) => {
        connections[id] = connection;
    },
    removeConnection: (id) => {
        delete connections[id];
    },
    sendMessage: (id, message) => {
        const connection = connections[id];
        if(!connection) {
            return;
        }

        console.log(message);
        connection.send(JSON.stringify(message));
    },
    getAllProjects: async (projectRepository: ProjectRepository) => {
        const projects = await projectRepository.getAllProjects();
        return projects;
    },
    createProject: async (
        projectRepository: ProjectRepository,
        userRepository: UserRepository,
        req: AuthenticatedRequest) => {
            const headers = req.headers;
            let authorization = headers.authorization;
            if(!authorization.startsWith('Bearer ')) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            authorization = authorization.substring(7, authorization.length);
            let user = authenticationService.retrieveUser(authorization);
            if (!user) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            const users = await userRepository.findUserByUsername(user.username);
            user = users[0];

            const body = req.body;
            const name = body.name;
            const projectImageUrl = body.projectImageUrl;
            if(!name || !projectImageUrl) {
                return 'No name or no project image is passed';
            }

            const projectPassedInBody = req.body.project;

            const defaultPage: Page = {
                id: uuid.v1(),
                name: 'Home',
                route: '/',
                elements: []
            };

            const project = projectPassedInBody ? projectPassedInBody :
                new ProjectModel(
                    uuid.v1(),
                    name,
                    user.username,
                    user.id,
                    projectImageUrl,
                    [defaultPage]);

            await projectRepository.addProject(project);
            user.projects.push(project);
            await userRepository.updateUser(user.username, user);
            return project;
        },
    editProject: async (
        projectRepository: ProjectRepository,
        userRepository: UserRepository,
        req: AuthenticatedRequest) => {
            const headers = req.headers;
            let authorization = headers.authorization;
            if(!authorization || !authorization.startsWith('Bearer ')) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            authorization = authorization.substring(7, authorization.length);
            let user = authenticationService.retrieveUser(authorization);
            if (!user) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            const users = await userRepository.findUserByUsername('martin');
            user = users[0];

            const pages = req.body.pages;
            const id = req.params.id;

            let projects;
            if(!pages) {
                projects = await projectRepository.findProjectById(id);
                if(projects.length !== 1) {
                    return `No project with ${id} was found`;
                }

                return projects[0];
            }

            projects = await projectRepository.findProjectById(id);
            const project = projects[0];
            const index = user.projects.findIndex((p) => (p.id === id));

            project.pages = pages;
            user.projects[index] = project;

            await userRepository.updateUser(user.username, user);

            await projectRepository.updateProject(project.id, project);

            return project;
        },

        getDeploymentInformation: async (
            deploymentRepository: DeploymentRepository,
            req: AuthenticatedRequest
        ) => {
            const id = req.params.id;

            const deployments = await deploymentRepository
                .findDeploymentById(id);

            if(deployments.length !== 1) {
                return 'This project has\'t beem deployed yet';
            }

            return deployments[0];
        },

        getDeploymentTemplates: async (
            projectRepository: ProjectRepository,
            req: AuthenticatedRequest) => {
            const id: string = req.params.id;
            const projects = await projectRepository.findProjectById(id);
            if(projects.length < 1) {
                return 'No projects found';
            }

            const project = projects[0];

            const templates = templatingService.getAllTemplates(project.name, project.pages,
                project.projectImageUrl);
            return templates;
        },

        deployProject: async (
            projectRepository: ProjectRepository,
            deploymentRepository: DeploymentRepository,
            req: AuthenticatedRequest) => {
                const headers = req.headers;
                let authorization = headers.authorization;
                if(!authorization || !authorization.startsWith('Bearer ')) {
                    return constants.UNAUTHORIZED_USER_MESSAGE;
                }

                authorization = authorization.substring(7, authorization.length);
                const user = authenticationService.retrieveUser(authorization);
                if (!user) {
                    return constants.UNAUTHORIZED_USER_MESSAGE;
                }

                const id = req.params.id;
                const foundProjects = await projectRepository.findProjectById(id);
                if(foundProjects.length !== 1) {
                    return 'No project was found';
                }

                const project = foundProjects[0];
                const url = await deploymentService.deployProject(controller, project, deploymentRepository);
                return {
                    message: constants.SUCCESSFULL_DEPLOYMENT,
                    projectUrl: url
                };
        }
};

export default controller;
