import ProjectRepository from '../../models/repositories/ProjectRepository';
import UserRepository from '../../models/repositories/UserRepository';
import AuthenticatedRequest from '../auth/contracts/AuthentedRequest';

import constants from '../../constants/constants';
import ProjectModel from '../../models/ProjectModel';
import authenticationService from '../../services/authentication.service';
import { Status } from '../../models/contracts/Project';
import deploymentService from '../../services/deployment.service';

const uuid = require('uuid');

const controller = {
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

            const project = projectPassedInBody ? projectPassedInBody :
                new ProjectModel(
                    uuid.v1(),
                    name,
                    user.username,
                    user.id,
                    projectImageUrl,
                    [],
                    Status.inDevelopment,
                    '');

            await projectRepository.addProject(project);
            user.projects.push(project);
            await userRepository.updateUser(user.username, user);
            return project;
        },
    editProject: async (
        projectRepository: ProjectRepository,
        userRepository: UserRepository,
        req: AuthenticatedRequest) => {
            // const headers = req.headers;
            // let authorization = headers.authorization;
            // if(!authorization || !authorization.startsWith('Bearer ')) {
            //     return constants.UNAUTHORIZED_USER_MESSAGE;
            // }

            // authorization = authorization.substring(7, authorization.length);
            // let user = authenticationService.retrieveUser(authorization);
            // if (!user) {
            //     return constants.UNAUTHORIZED_USER_MESSAGE;
            // }

            const users = await userRepository.findUserByUsername('martin');
            const user = users[0];

            const pages = req.body.pages;
            const id = req.params.id;

            if(!pages) {
                const projects = await projectRepository.findProjectById(id);
                if(projects.length !== 1) {
                    return `No project with ${id} was found`;
                }

                return projects[0];
            }

            const projects = await projectRepository.findProjectById(id);
            const project = projects[0];
            console.log(user.projects);
            console.log(project);
            const index = user.projects.findIndex((p) => (p.id === id));

            project.pages = pages;
            user.projects[index] = project;
            console.log('user.projects', user.projects);

            await userRepository.updateUser(user.username, user);

            await projectRepository.updateProject(project.id, project);

            return project;
        },

        deployProject: async (
            projectRepository: ProjectRepository,
            userRepository: UserRepository,
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
                const url = await deploymentService.deployProject(project);
                return {
                    message: constants.SUCCESSFULL_DEPLOYMENT,
                    projectUrl: url
                };
        }
};

export default controller;
