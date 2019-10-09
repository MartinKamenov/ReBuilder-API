import SetupConfiguration from './setup/SetupConfiguration';
import Route from './routes/contracts/Route';
import AuthRoute from './routes/auth/auth-route';
import ProjectRoute from './routes/project/project-route';

import database from './database/connector';
import ProjectRepository from './models/repositories/ProjectRepository';
import UserRepository from './models/repositories/UserRepository';
import DeploymentRepository from './models/repositories/DeploymentRepository';

const fs = require('fs');
const https = require('https');
const privateKey  = fs.readFileSync('./cert.key', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate, passphrase : 'pesho'};

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const start = (setupConfiguration: SetupConfiguration) => {
    const app = express();

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

    const projectRepository = new ProjectRepository(database, 'projects');
    const userRepository = new UserRepository(database, 'users');
    const deploymentRepository = new DeploymentRepository(database, 'deployments');

    const routes: Route[] = [
        new AuthRoute(app, userRepository),
    ];

    routes.forEach((route) => {
        route.attach();
    });

    // app.listen(setupConfiguration.port, setupConfiguration.listenCallback);
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(setupConfiguration.port);

    const projectRoute = new ProjectRoute(app, projectRepository, userRepository, deploymentRepository, httpsServer);
    projectRoute.attach();
};

module.exports = start;
