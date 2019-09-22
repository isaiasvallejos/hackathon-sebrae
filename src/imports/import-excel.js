const moment = require('moment');
const data = require('../../generated/ti-excel.json');
const database = require('../vendor/database');

data.forEach(row => {
    Object.keys(row).forEach(key => {
        const value = row[key];

        if(value === '' || value === '-') {
            row[key] = null;
        }
    });
});

const rows = data.map(row => {
    let foundation_date = moment(row.F, 'MM/YYYY');
    if(foundation_date.isValid()) {
        foundation_date = foundation_date.format('YYYY-MM-DD');
    } else {
        foundation_date = null;
    }

    return ({
        registration: row.A,
        company_name: row.B,
        trading_name: row.C,
        postage: row.D,
        number_collaborators: row.E,
        foundation_date,
        cep: row.G,
        uf: row.H,
        city: row.I,
        district: row.J,
        address: row.K,
        address_number: row.L,
        complement: row.M,
        latitude: row.N ? parseFloat(row.N.replace(",", ".")) : null,
        longitude: row.O ? parseFloat(row.N.replace(",", ".")) : null,
        email: row.Q,
        phone: row.R,
        mobile_phone: row.S,
        commercial_phone: row.T,
        fax_phone: row.U,
        code_legal_nature: row.V,
        cnae: row.W,
        sector: row.X,
        activity: row.Y
    })
});

database('sebrae').insert(rows)
    .then(console.log);
