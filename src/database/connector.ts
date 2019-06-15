import Database from "./database";

const username = process.env.dbUser || 
    require('../../../credentials/credentialManager').dbUser;
const password = process.env.dbPassword || 
    require('../../../credentials/credentialManager').dbPassword;

const connectionstring = `mongodb://${username}:${password}@ds235417.mlab.com:35417/rebuilder-db`;
const connector = new Database(connectionstring);

export default connector;