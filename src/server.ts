import SetupConfiguration from "./setup/SetupConfiguration";

const express = require('express');
const cors = require('cors');

const start = (setupConfiguration: SetupConfiguration) => {
    const app = express();

    app.use(cors());

    app.listen(setupConfiguration.port, setupConfiguration.listenCallback);
};

module.exports = start;
