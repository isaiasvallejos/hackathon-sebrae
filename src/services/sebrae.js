const database = require('../vendor/database');

const getCompaniesWithoutReceitaFederal = () =>
    database
        .select('sebrae.*')
        .table('sebrae')
        .leftJoin('receita_federal', 'sebrae.registration', 'receita_federal.registration')
        .whereNull('receita_federal.registration');

const getCompaniesWithoutGooglePlaces = () =>
    database
        .select('sebrae.*')
        .table('sebrae')
        .leftJoin('google_places', 'sebrae.registration', 'google_places.registration')
        .whereNull('google_places.registration');

module.exports = {
    getCompaniesWithoutReceitaFederal,
    getCompaniesWithoutGooglePlaces
};
