import SetupConfiguration from './setup/SetupConfiguration';
import Route from './routes/contracts/Route';
import AuthRoute from './routes/auth/auth-route';
import ProjectRoute from './routes/project/project-route';

import database from './database/connector';
import ProjectRepository from './models/repositories/ProjectRepository';
import UserRepository from './models/repositories/UserRepository';
import DeploymentRepository from './models/repositories/DeploymentRepository';

const fs = require('fs');

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const start = (setupConfiguration: SetupConfiguration) => {
    const app = express();

    const projectRepository = new ProjectRepository(database, 'projects');
    const userRepository = new UserRepository(database, 'users');
    const deploymentRepository = new DeploymentRepository(database, 'deployments');

    const routes: Route[] = [
        new AuthRoute(app, userRepository),
        new ProjectRoute(app, projectRepository, userRepository, deploymentRepository)
    ];

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

    routes.forEach((route) => {
        route.attach();
    });

    app.listen(setupConfiguration.port, setupConfiguration.listenCallback);
};

module.exports = start;
