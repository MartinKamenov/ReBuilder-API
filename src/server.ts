import SetupConfiguration from './setup/SetupConfiguration';
import Route from './routes/contracts/Route';
import AuthRoute from './routes/auth/auth-route';
import ProjectRoute from './routes/project/project-route';

import database from './database/connector';
import ProjectRepository from './models/repositories/ProjectRepository';
import UserRepository from './models/repositories/UserRepository';

const express = require('express');
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const bodyParser = require('body-parser');

const start = (setupConfiguration: SetupConfiguration) => {
    const app = express();

    const projectRepository = new ProjectRepository(database, 'projects');
    const userRepository = new UserRepository(database, 'users');

    const routes: Route[] = [
        new AuthRoute(app, userRepository),
        new ProjectRoute(app, projectRepository, userRepository),
    ];

    app.use(cors(corsOptions));
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

    routes.forEach((route) => {
        route.attach();
    });

    app.listen(setupConfiguration.port, setupConfiguration.listenCallback);
};

module.exports = start;
