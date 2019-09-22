const fs = require('fs');

const readGeneratedJson = name =>
    JSON.parse(fs.readFileSync(`generated/${name}.json`, 'UTF-8'));

const writeGeneratedJson = (name, data) =>
    fs.writeFileSync(`generated/${name}.json`, JSON.stringify(data));

module.exports = {
    readGeneratedJson,
    writeGeneratedJson
};
