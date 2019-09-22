const request = require('../util/request');
const database = require('../vendor/database');

const getData = cnpj => {
    const options = {
        method: 'GET',
        uri: `https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
        json: true,
        timeout: 5000
    };

    return request.requestWithProxy(options);
};

const create = (registration, json) =>
    database('receita_federal')
        .insert({
            registration,
            json
        });

module.exports = {
    getData,
    create
};
