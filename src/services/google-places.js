const { map } = require('bluebird');
const { request } = require('../util/request');
const database = require('../vendor/database');

const getPlacesIdByName = async name => {
    const response = await request({
        method: 'GET',
        uri: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name}&inputtype=textquery&key=${process.env.GOOGLE_API_TOKEN}`,
        json: true
    });

    return response.candidates.map(candidate => candidate.place_id);
};

const getPlaceById = async id => {
    const response = await request({
        method: 'GET',
        uri: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${process.env.GOOGLE_API_TOKEN}`,
        json: true
    });

    return response.result;
};

const getNearByPlacesByPlace = async place => {
    const latitude = place.geometry.location.lat;
    const longitude = place.geometry.location.lng;

    const response = await request({
        method: 'GET',
        uri: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&key=${process.env.GOOGLE_API_TOKEN}`,
        json: true
    });

    return response.result;
};

const getFullPlaceByName = async name => {
    const placesWithIds = await getPlacesIdByName(name);
    return map(placesWithIds, getPlaceById);
};

const create = (registration, json) =>
    database('google_places')
        .insert({
            registration,
            json: json[0]
        });

module.exports = {
    getPlaceById,
    getPlacesIdByName,
    getFullPlaceByName,
    getNearByPlacesByPlace,
    create
};
