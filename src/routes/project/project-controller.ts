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
import Project from '../../models/contracts/Project';

const uuid = require('uuid');
const connections = {};

const getAuthorizedUser = (req: AuthenticatedRequest) => {
    let authorization = req.body.authorization;
    if(!authorization || !authorization.startsWith('Bearer ')) {
        return constants.UNAUTHORIZED_USER_MESSAGE;
    }

    authorization = authorization.substring(7, authorization.length);
    const user = authenticationService.retrieveUser(authorization);
    return user;
};

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
            let user = getAuthorizedUser(req);
            if (!user) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            const users = await userRepository.findUserByUsername(user.username);
            user = users[0];

            const body = req.body;
            const name = body.name;
            const projectImageUrl = body.projectImageUrl;
            const description = body.description || null;
            if(!name || !projectImageUrl) {
                return 'No name or no project image is passed';
            }

            const projectPassedInBody = req.body.project;

            const defaultBody = {
                name: 'Body',
                title: 'Body',
                index: 'body',
                style: {
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    width: '100%',
                    height: '100%',
                    marginLeft: '0px',
                    marginRight: '0px',
                    marginTop: '0px',
                    marginBottom: '0px',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    paddingTop: '0px',
                    paddingBottom: '0px'
                }
            };

            const defaultPage: Page = {
                id: uuid.v1(),
                name: 'Home',
                route: '/',
                elements: [ defaultBody ]
            };

            const project = projectPassedInBody ? projectPassedInBody :
                new ProjectModel(
                    uuid.v1(),
                    name,
                    user.username,
                    user.id,
                    projectImageUrl,
                    [defaultPage],
                    description,
                    new Date(),
                    new Date());

            await projectRepository.addProject(project);
            user.projects.push(project);
            await userRepository.updateUser(user.username, user);
            return project;
        },
    editProject: async (
        projectRepository: ProjectRepository,
        userRepository: UserRepository,
        req: AuthenticatedRequest) => {
            let user = getAuthorizedUser(req);
            if (!user) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            const users = await userRepository.findUserByUsername(user.username);
            user = users[0];

            const pages = req.body.pages;
            const id = req.params.id;

            let projects: Project[] | null = null;
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
            project.lastUpdated = new Date();
            user.projects[index] = project;

            await userRepository.updateUser(user.username, user);

            await projectRepository.updateProject(project.id, project);

            return project;
        },
        updateProjectInformation: async (
            projectRepository: ProjectRepository,
            userRepository: UserRepository,
            req: AuthenticatedRequest) => {
            let user = getAuthorizedUser(req);
            if (!user) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            const users = await userRepository.findUserByUsername(user.username);
            user = users[0];

            const description = req.body.description || null;
            const name = req.body.name;
            const projectImageUrl = req.body.projectImageUrl;
            const id = req.params.id;

            let projects: Project[] | null = null;

            projects = await projectRepository.findProjectById(id);
            const project = projects[0];
            if(!name || !projectImageUrl) {
                return project;
            }

            const index = user.projects.findIndex((p) => (p.id === id));

            project.name = name;
            project.projectImageUrl = projectImageUrl;
            project.description = description;
            project.lastUpdated = new Date();
            user.projects[index] = project;

            console.log('New project ', project);

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
                const user = getAuthorizedUser(req);
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
