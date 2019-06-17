import Database from '../../database/Database';
import User from '../contracts/User';

export default class UserRepository {
    constructor(private database: Database, private collectionName: String) {}
    getAllUsers(): Promise<User[]> {
        return this.database.showAll(this.collectionName);
    }

    addUser(user: User): Promise<User[]> {
        return this.database.insert(this.collectionName, user);
    }

    findUserByUsername(username: String): Promise<User[]> {
        return this.database.find(this.collectionName, {username});
    }

    findUserByParams(params: Object): Promise<User[]> {
        return this.database.find(this.collectionName, params);
    }

    updateUser(username: User, newUser: User): Promise<User[]> {
        return this.database.update(this.collectionName, {username}, newUser);
    }
};
