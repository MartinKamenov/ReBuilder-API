import ProjectRepository from '../../models/repositories/ProjectRepository';
import UserRepository from '../../models/repositories/UserRepository';
import AuthenticatedRequest from '../auth/contracts/AuthentedRequest';

import constants from '../../constants/constants';
import ProjectModel from '../../models/ProjectModel';
import authenticationService from '../../services/authentication.service';
import { Status } from "../../models/contracts/Project";

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
            const user = authenticationService.retrieveUser(authorization);
            if (!user) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            const body = req.body;
            let name = body.name;
            const projectImageUrl = body.projectImageUrl;
            if(!name || !projectImageUrl) {
                name = name.trim();
                return 'No name or no project image is passed';
            }

            const project =
                new ProjectModel(uuid.v1(), name, user.username, user.id, projectImageUrl, [], Status.inDevelopment);
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
            const user = authenticationService.retrieveUser(authorization);
            if (!user) {
                return constants.UNAUTHORIZED_USER_MESSAGE;
            }

            const components = req.body.components;
            const id = req.params.id;

            if(!components) {
                const projects = await projectRepository.findProjectById(id);
                if(projects.length !== 1) {
                    return `No project with ${id} was found`;
                }

                return projects[0];
            }

            let index = -1;
            const project = user.projects.find((p, i) => {
                if(p.id === id) {
                    index = i;
                }

                return p.id === id;
            });

            project.components = components;
            user.projects[index] = project;

            await userRepository.updateUser(user.username, user);

            await projectRepository.updateProject(project.id, project);

            return project;
        },
};

export default controller;
