const { MongoClient, ObjectID } = require('mongodb');

class Database {

    constructor(private connectionString: string) {
        this.connection = new Promise((resolve) => {
            resolve(MongoClient.connect(this.connectionString));
        });
    }

    private connection: any;

    insert(collection, record): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection
                .then((db) => {
                    const insertCollection = db.collection(collection);
                    insertCollection.insert(record);
                    resolve(insertCollection
                        .find()
                        .toArray());
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }

    update(collection, filter, record): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection
                .then((db) => {
                    const updateCollection = db.collection(collection);
                    updateCollection.update(filter, record);
                    resolve(updateCollection
                        .find()
                        .toArray());
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }

    showAll(collection): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection
                .then((db) => {
                    const showCollection = db.collection(collection)
                        .find()
                        .toArray();
                    resolve(showCollection);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }

    find(collection, filter): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection
                .then((db) => {
                    const findCollection = db.collection(collection)
                        .find(filter)
                        .toArray();
                    resolve(findCollection);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }

    findOne(collection, filter): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection
                .then((db) => {
                    const found = db.collection(collection)
                        .findOne(filter);
                    resolve(found);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }

    findById(collection, id): Promise<Array<any>> {
        const objectId = new ObjectID(id);
        return new Promise((resolve, reject) => {
            this.connection
                .then((db) => {
                    const findCollection = db.collection(collection)
                        .find({ '_id': objectId })
                        .toArray();
                    resolve(findCollection);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }

    delete(collection, filter): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection
                .then((db) => {
                    const deleteCollection = db.collection(collection);
                    deleteCollection.deleteMany(filter);
                    resolve(deleteCollection
                        .find()
                        .toArray());
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }

    deleteAll(collection): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection
                .then((db) => {
                    const deleteCollection = db.collection(collection);
                    deleteCollection.deleteMany({});
                    resolve(deleteCollection
                        .find()
                        .toArray());
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }
}

export default Database;
