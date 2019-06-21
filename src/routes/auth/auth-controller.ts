import constants from "../../constants/constants";
import AuthenticatedRequest from "./contracts/AuthentedRequest";
import LogoutRequest from "./contracts/LogoutRequest";

const controller = {
    logout: (requestObject: LogoutRequest) => {
        requestObject.logout();
        return constants.SUCCESSFULL_LOGOUT_MESSAGE;
    },

    getUser: (requestObject: AuthenticatedRequest) => {
        return requestObject.user;
    },
};

export default controller;
