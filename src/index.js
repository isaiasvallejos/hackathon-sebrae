require('dotenv').config();

const { startProxiesTask } = require('./tasks/proxies');
const { startReceitaFederalCreateTask } = require('./tasks/receita-federal');
const { startGooglePlacesCreateTask } = require('./tasks/google-places');

startProxiesTask();
startReceitaFederalCreateTask();
startGooglePlacesCreateTask();

process.on('uncaughtException', error => {
    console.log('uncaugth exception', error);
});
