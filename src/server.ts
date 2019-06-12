import SetupConfiguration from "./setup/SetupConfiguration";

const express = require('express');

const start = (setupConfiguration: SetupConfiguration) => {
    const app = express();

    app.listen(setupConfiguration.port, setupConfiguration.listenCallback);
};

module.exports = start;
