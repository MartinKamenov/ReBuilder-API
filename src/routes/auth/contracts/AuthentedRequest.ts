import User from '../../../models/contracts/User';
import RequestInterface from '../../../models/server/RequestInterface';

export default interface AuthenticatedRequest extends RequestInterface {
    user: User;
}
