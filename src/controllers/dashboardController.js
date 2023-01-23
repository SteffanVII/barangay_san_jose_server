const { db } = require("../mysqlConnect");

function getDashboardInfo( request, response ) {

    let now = new Date();
    let I = now.getUTCFullYear();
    let II = now.getUTCFullYear() - 1;
    let III = now.getUTCFullYear() - 2;
    let IV = now.getUTCFullYear() - 3;
    let V = now.getUTCFullYear() - 4;

    const details = {
        residentsCount : 0,
        documentServe : 0,
        pendingRequests : 0,
        blotters : 0,
        gender : {
            male : 0,
            female : 0
        },
        voter : {
            yes : 0,
            no : 0
        },
        populationGrowth : [
            [ I, 0 ],
            [ II, 0 ],
            [ III, 0 ],
            [ IV, 0 ],
            [ V, 0 ]
        ]
    };

    db.query( "select count(*) from resident" )
        .then( res => {
            details.residentsCount = res[0]["count(*)"];

            let q = `select count(*) from requests where status = 3`;
            return db.query( q );
        } )
        .then( res => {
            details.documentServe = res[0]["count(*)"];

            let q = `select count(*) from requests where status = 0`;
            return db.query( q );
        } )
        .then( res => {
            details.pendingRequests = res[0]["count(*)"];

            let q = `select count(*) from blotters`;
            return db.query( q );
        } )
        .then( res => {
            details.blotters = res[0]["count(*)"];

            let q = `select count(*) from resident where gender = 0`;
            return db.query( q );
        } )
        .then( res => {
            details.gender.male = res[0]["count(*)"];

            let q = `select count(*) from resident where gender = 1`;
            return db.query( q );
        } )
        .then( res => {
            details.gender.female = res[0]["count(*)"];

            let q = `select count(*) from resident where registered = 0`;
            return db.query( q );
        } )
        .then( res => {
            details.voter.no = res[0]["count(*)"];

            let q = `select count(*) from resident where registered = 1`;
            return db.query( q );
        } )
        .then( res => {
            details.voter.yes = res[0]["count(*)"];

            let q = `select count(*) from resident where year(date_recorded) = ${I}`;
            return db.query( q );
        } )
        .then( res => {
            details.populationGrowth[0][1] = res[0]["count(*)"];

            let q = `select count(*) from resident where year(date_recorded) = ${II}`;
            return db.query( q );
        } )
        .then( res => {
            details.populationGrowth[1][1] = res[0]["count(*)"];

            let q = `select count(*) from resident where year(date_recorded) = ${III}`;
            return db.query( q );
        } )
        .then( res => {
            details.populationGrowth[2][1] = res[0]["count(*)"];

            let q = `select count(*) from resident where year(date_recorded) = ${IV}`;
            return db.query( q );
        } )
        .then( res => {
            details.populationGrowth[3][1] = res[0]["count(*)"];

            let q = `select count(*) from resident where year(date_recorded) = ${V}`;
            return db.query( q );
        } )
        .then( res => {
            details.populationGrowth[4][1] = res[0]["count(*)"];

            // let q = `select count(*) from residents where year(date_recorded) = ${V}`;
            // return db.query( q );
        } )
        .then( res => {
            response.status(200).json(details);
        } )
        .catch( err => console.log(err) );
}

module.exports = { getDashboardInfo };