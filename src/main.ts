import SetupConfiguration from './setup/SetupConfiguration';

const start = require('./server');
const port = process.env.PORT || '5000';

const setupConfiguration = new SetupConfiguration(port, () => {
    console.log(`Magic is running on ${port}`);
});

start(setupConfiguration);
