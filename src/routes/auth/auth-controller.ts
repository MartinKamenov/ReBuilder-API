import AuthenticatedRequest from './contracts/AuthentedRequest';
import UserRepository from '../../models/repositories/UserRepository';
import RequestInterface from '../../models/server/RequestInterface';
import constants from '../../constants/constants';
import secret from '../../setup/secret.config';
import UserModel from '../../models/UserModel';
import authenticationService from '../../services/authentication.service';
import LogoutRequest from './contracts/LogoutRequest';
const uuid = require('uuid');

const jwt = require('jsonwebtoken');

const controller = {
    logIn: async (req: RequestInterface, userRepository: UserRepository) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return constants.UNAUTHORIZED_USER_MESSAGE;
        }

        const users = await userRepository.findUserByParams({ username, password });
        if (users.length !== 1) {
            return constants.UNAUTHORIZED_USER_MESSAGE;
        }

        const user = new UserModel(
            users[0].id,
            users[0].username,
            users[0].password,
            users[0].email,
            users[0].imageUrl,
            users[0].projects
        );
        const token = jwt.sign({ user },
            secret,
            {
                expiresIn: '14d'
            }
        );

        return {
            success: true,
            message: constants.SUCCESSFULL_LOGIN_MESSAGE,
            user,
            token
        };
    },

    register: async (req: RequestInterface, userRepository: UserRepository) => {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const imageUrl = req.body.imageUrl;
        const projects = [];

        if (!username || !password || !email || !imageUrl) {
            return constants.UNAUTHORIZED_USER_MESSAGE;
        }

        const user = new UserModel(uuid.v1(), username, password, email, imageUrl, projects);

        const foundUsers = await userRepository.findUserByUsername(username);
        if(foundUsers.length > 0) {
            return constants.USERNAME_IS_TAKEN_MESSAGE;
        }

        await userRepository.addUser(user);

        const token = jwt.sign({ user },
            secret,
            {
                expiresIn: '14d'
            }
        );

        return {
            success: true,
            message: constants.SUCCESSFULL_REGISTRATION_MESSAGE,
            user,
            token
        };
    },
    getUser: async (requestObject: RequestInterface, userRepository: UserRepository) => {
        const token: string = requestObject.body.token;
        if(!token) {
            return constants.UNAUTHORIZED_USER_MESSAGE;
        }

        let user = authenticationService.retrieveUser(token);
        const users = await userRepository.findUserByUsername(user.username);
        user = users[0];
        return user;
    },
    updateUser: async (requestObject: RequestInterface, userRepository: UserRepository) => {
        const token: string = requestObject.body.token;
        if(!token) {
            return constants.UNAUTHORIZED_USER_MESSAGE;
        }

        let user = authenticationService.retrieveUser(token);
        const users = await userRepository.findUserByUsername(user.username);
        user = users[0];

        const imageUrl = requestObject.body.imageUrl;
        user.imageUrl = imageUrl;

        await userRepository.updateUser(user.username, user);
        return 'Successfully updated';
    }
};

export default controller;
