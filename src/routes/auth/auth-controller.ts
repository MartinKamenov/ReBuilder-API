import AuthenticatedRequest from './contracts/AuthentedRequest';
import LogoutRequest from './contracts/LogoutRequest';
import UserRepository from '../../models/repositories/UserRepository';
import RequestInterface from '../../models/server/RequestInterface';
import constants from '../../constants/constants';
import middleware from '../../jwt/middleware';
import secret from '../../setup/secret.config';
import UserModel from '../../models/UserModel';
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
                expiresIn: '24h'
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

        await userRepository.addUser(user);

        const token = jwt.sign({ user },
            secret,
            {
                expiresIn: '24h'
            }
        );

        return {
            success: true,
            message: constants.SUCCESSFULL_REGISTRATION_MESSAGE,
            user,
            token
        };
    },
    logout: (requestObject: LogoutRequest) => {
        requestObject.logout();
        return constants.SUCCESSFULL_LOGOUT_MESSAGE;
    },

    getUser: (requestObject: AuthenticatedRequest) => {
        return requestObject.user;
    },
};

export default controller;
