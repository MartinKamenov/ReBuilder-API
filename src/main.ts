import SetupConfiguration from './setup/SetupConfiguration';

const start = require('./server');
const port = process.env.PORT || '5000';
const host = null;

const setupConfiguration = new SetupConfiguration(port, host, () => {
    // tslint:disable-next-line:no-console
    console.log(`Magic is running on ${port}`);
});

start(setupConfiguration);
