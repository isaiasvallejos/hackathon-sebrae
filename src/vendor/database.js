
module.exports = require('knex')({
    client: 'pg',
    connection: process.env.POSTGRES_CONNECTION_STRING,
    searchPath: ['public']
});
