const { delay } = require('../util/promise');
const { map, each } = require('bluebird');

const sebrae = require('../services/sebrae');
const googlePlaces = require('../services/google-places');

const startGooglePlacesCreateTask = async () => {
    console.log('started google places create task');

    const companies = await sebrae.getCompaniesWithoutGooglePlaces();
    console.log('companies without google places found', companies.length);

    await map(companies,
        async ({ company_name, registration, address, district, address_number, city, cep, uf, trading_name }) => {
            const fullAddress = `${address}, ${address_number} - ${district} - ${city} - ${uf}, ${cep}`;

            try {
                console.log('searching by', trading_name || fullAddress || company_name);

                const json = await googlePlaces.getFullPlaceByName(trading_name || fullAddress || company_name);
                const created = await googlePlaces.create(registration, json);
                console.log('company with registration', registration, 'was updated with google places');

                return created;
            } catch(error) {
                console.error('error at google places');
            }

        }, { concurrency: 1 });

    await delay(10000);
    return startGooglePlacesCreateTask();
};

module.exports = {
    startGooglePlacesCreateTask
};
