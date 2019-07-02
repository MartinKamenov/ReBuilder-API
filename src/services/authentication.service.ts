import secret from '../setup/secret.config';
const jwt = require('jsonwebtoken');

const authenticationService = {
    isAuthenticated: (token: string): boolean => {
        try {
            const decoded = jwt.verify(token, secret);
            return true;
        } catch (e) {
            return false;
        }
    },

    retrieveUser: (token: string) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        } catch (e) {
            return null;
        }
        const user = decoded.user;
        return user;
    }
};

export default authenticationService;
