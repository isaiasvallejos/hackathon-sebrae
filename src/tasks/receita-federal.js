const { delay } = require('../util/promise');
const { map, each } = require('bluebird');

const sebrae = require('../services/sebrae');
const receitaFederal = require('../services/receita-federal');

const startReceitaFederalCreateTask = async () => {
    console.log('started receita federal create task');

    const companies = await sebrae.getCompaniesWithoutReceitaFederal();
    console.log('companies without receita federal found', companies.length);

    await map(companies, async ({ registration }) => {
        const json = await receitaFederal.getData(registration);
        const created = await receitaFederal.create(registration, json);

        console.log('company with registration', registration, 'was updated with receita federal');
        return created;
    });

    await delay(10000);
    return startReceitaFederalCreateTask();
};

module.exports = {
    startReceitaFederalCreateTask
};
