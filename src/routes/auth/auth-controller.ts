import constants from '../../constants/constants';
import AuthenticatedRequest from './contracts/AuthentedRequest';
import LogoutRequest from './contracts/LogoutRequest';
import UserRepository from '../../models/repositories/UserRepository';
import RequestInterface from '../../models/server/RequestInterface';
import constants from '../../constants/constants';

const controller = {
    logIn: async (req: RequestInterface, userRepository: UserRepository) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return;
        }

        const users = await userRepository.findUserByParams({ username, password });
        if (users.length !== 1) {
            return constants.UNAUTHORIZED_USER_MESSAGE;
        }
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
