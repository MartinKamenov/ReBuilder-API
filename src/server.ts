import SetupConfiguration from "./setup/SetupConfiguration";
import Route from "./routes/contracts/Route";
import AuthRoute from "./routes/auth/auth-route";
import ProjectRoute from "./routes/project/project-route";

import database from './database/connector';
import ProjectRepository from "./models/repositories/ProjectRepository";
import UserRepository from "./models/repositories/UserRepository";

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

    const projectRepository = new ProjectRepository(database, 'projects');
    const userRepository = new UserRepository(database, 'users');
    
    const routes: Array<Route> = [
        new AuthRoute(app),
        new ProjectRoute(app, projectRepository)
    ];

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

    routes.forEach((route) => {
        route.attach();
    });
    
    app.listen(setupConfiguration.port, setupConfiguration.listenCallback);
};

module.exports = start;
