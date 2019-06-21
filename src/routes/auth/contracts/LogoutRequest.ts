import RequestInterface from '../../../models/server/RequestInterface';

export default interface LogoutRequest  extends RequestInterface {
    logout: () => string;
}
