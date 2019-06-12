import SetupConfiguration from "./setup/SetupConfiguration";

const express = require('express');
const cors = require('cors');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const sessionSecret = process.env.sessionSecret || 
    require('../../credentials/credentialManager').sessionSecret;

const start = (setupConfiguration: SetupConfiguration) => {
    const app = express();

    app.use(cors());

    app.use(cookieParser('secret'));
    app.use(session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 600000000
        },
    }));
    app.use(flash());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

    app.listen(setupConfiguration.port, setupConfiguration.listenCallback);
};

module.exports = start;
