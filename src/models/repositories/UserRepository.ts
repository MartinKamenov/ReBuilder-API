import Database from '../../database/Database';

export default class UserRepository {
    constructor(private database: Database, private collectionName: String) {}
    getAllUsers() {
        return this.database.showAll(this.collectionName);
    }

    addUser(user) {
        return this.database.insert(this.collectionName, user);
    }

    findUserByUsername(username) {
        return this.database.find(this.collectionName, {username});
    }

    findUserByParams(params) {
        return this.database.find(this.collectionName, params);
    }

    updateUser(username, newUser) {
        return this.database.update(this.collectionName, {username}, newUser);
    }
};
