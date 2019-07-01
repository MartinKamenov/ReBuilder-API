const secret = process.env.sessionSecret ||
    require('../../../credentials/credentialManager').sessionSecret;

export default secret;
