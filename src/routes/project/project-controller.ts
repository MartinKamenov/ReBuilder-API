import ProjectRepository from "../../models/repositories/ProjectRepository";
import UserRepository from "../../models/repositories/UserRepository";
import AuthenticatedRequest from "../auth/contracts/AuthentedRequest";

import constants from '../../constants/constants';
import ProjectModel from "../../models/ProjectModel";
import authenticationService from '../../services/authentication.service';

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

            const project = new ProjectModel(uuid.v1(), name, user.username, user.id, projectImageUrl, []);
            await projectRepository.addProject(project);
            user.projects.push(project);
            await userRepository.updateUser(user.username, user);
            return project;
        },
};

export default controller;
