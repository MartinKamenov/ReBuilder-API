import Database from '../../database/Database';
import User from '../User';

export default class UserRepository {
    constructor(private database: Database, private collectionName: String) {}
    getAllUsers() {
        return this.database.showAll(this.collectionName);
    }

    addUser(user: User) {
        return this.database.insert(this.collectionName, user);
    }

    findUserByUsername(username: String) {
        return this.database.find(this.collectionName, {username});
    }

    findUserByParams(params: Object) {
        return this.database.find(this.collectionName, params);
    }

    updateUser(username: User, newUser: User) {
        return this.database.update(this.collectionName, {username}, newUser);
    }
};
