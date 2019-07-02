import AuthenticatedRequest from './contracts/AuthentedRequest';
import LogoutRequest from './contracts/LogoutRequest';
import UserRepository from '../../models/repositories/UserRepository';
import RequestInterface from '../../models/server/RequestInterface';
import constants from '../../constants/constants';
import middleware from '../../jwt/middleware';
import secret from '../../setup/secret.config';

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

        const token = jwt.sign({ user: users[0] },
            secret,
            {
                expiresIn: '24h'
            }
        );

        return {
            success: true,
            message: constants.SUCCESSFULL_LOGIN_MESSAGE,
            user: users[0],
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
