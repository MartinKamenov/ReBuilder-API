const express = require('express');

const start = (setupConfiguration) => {
    const app = express();

    app.listen(setupConfiguration.port, setupConfiguration.listenCallback);
};

module.exports = start;