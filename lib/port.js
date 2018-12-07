const portfinder = require('portfinder');

module.port = -1;

module.exports = {
    async port () {
        if (module.port !== -1) {
            return module.port;
        }
        let port = await portfinder.getPortPromise({
            port: 10000
        });
        module.port = port;
        return port;
    }
};
