const rp = require('request-promise');
const { delay } = require('./promise');
const files = require('./files');

let failedProxies = [];
let successProxies = [];
let proxies = [];

const requestErrorIsProxyError = error =>
    error.message.includes('tunneling socket could not be established');

const requestErrorIsTimeoutError = error =>
    error.message.includes('ESOCKETTIMEDOUT');

const request = rp;

const requestWithProxy = async (options, proxyDelay = 25000) => {
    if(proxies.length === 0) {
        proxies = files.readGeneratedJson('proxies');
    }

    let proxy;

    if(successProxies.length > 0) {
        proxy = successProxies.shift();
        await delay(proxyDelay);
    } else {
        proxy = proxies.shift();
    }

    const currentProxyAsFailed = failedProxies.find(failedProxy => failedProxy === proxy);

    if(currentProxyAsFailed) {
        return requestWithProxy(options);
    }

    const optionsWithProxy = Object.assign({}, options, { proxy });

    try {
        const response = await request(optionsWithProxy);
        successProxies.push(proxy);

        return response;
    } catch (error) {
        if(requestErrorIsProxyError(error) || requestErrorIsTimeoutError(error)) {
            failedProxies.push(proxy);
            return requestWithProxy(options);
        }

        throw error;
    }
};

module.exports = {
    request,
    requestWithProxy
};
