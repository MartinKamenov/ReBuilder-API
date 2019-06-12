const port = process.env.PORT || 5000;

const setupConfiguration = {
    port,
    listenCallback: function() {
        console.log(`Magic is running on ${port}`);
    }
};

module.exports = setupConfiguration;