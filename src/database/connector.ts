import Database from './Database';

const username = process.env.dbUser || 
    require('../../../credentials/credentialManager').rebuilderUsername;
const password = process.env.dbPassword || 
    require('../../../credentials/credentialManager').rebuilderPassword;

const connectionstring = `mongodb://${username}:${password}@ds235417.mlab.com:35417/rebuilder-db`;
const connector = new Database(connectionstring);

export default connector;