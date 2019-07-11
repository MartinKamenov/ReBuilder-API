import secret from '../setup/secret.config';
import UserRepository from '../models/repositories/UserRepository';
const jwt = require('jsonwebtoken');

const authenticationService = {
    isAuthenticated: (token: string): boolean => {
        try {
            jwt.verify(token, secret);
            return true;
        } catch (e) {
            return false;
        }
    },

    retrieveUser: async (token: string, userRepository: UserRepository) => {
        try {
            const decoded = jwt.verify(token, secret);
            const jwtUser = decoded.user;
            const users = await userRepository.findUserByUsername(jwtUser.username);
            const user = users[0];
            return user;
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(e);
            return null;
        }
    }
};

export default authenticationService;
