import LogoutRequest from "./contracts/LogoutRequest";
import constants from "../../constants/constants";

const controller = {
    logout: function(requestObject: LogoutRequest) {
        requestObject.logout();
        return constants.SUCCESSFULL_LOGOUT_MESSAGE;
    }
};

export default controller;