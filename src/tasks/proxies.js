const ProxyLists = require('proxy-lists');
const files = require('../util/files');

const startProxiesTask = () => {
    console.log('started proxies task');
    files.writeGeneratedJson('proxies', []);

    ProxyLists.getProxies()
        .on('data', function(proxies) {
            console.log('find proxies', proxies.length);

            const proxiesAsFullUrl = proxies.map(proxy => `http://${proxy.ipAddress}:${proxy.port}`);

            const proxiesAlreadyWrite = files.readGeneratedJson('proxies');
            console.info('proxies at file', proxiesAlreadyWrite.length);

            files.writeGeneratedJson('proxies', proxiesAlreadyWrite.concat(proxiesAsFullUrl));
        });

};

module.exports = {
    startProxiesTask
};
