const { db } = require("../mysqlConnect");

async function getResidentsAll( request, response ) {
    const p = request.query;

    // Return value ...
    let ret = {
        entries : [],
        totalEntries : 0,
        currentPage : 1,
        totalPages : 0
    }   

    let query = "select * from resident limit ? offset ?";

    db.query( query, [ parseInt(p.entries), parseInt((p.page - 1) * p.entries) ] )
        .then( res => {
            ret.entries = res;
            ret.currentPage = p.page;
            return db.query( "select count(*) from resident" );
        } )
        .then( res => {
            ret.totalEntries = res[0]["count(*)"];
            ret.totalPages = Math.ceil(ret.totalEntries / p.entries);
            response.status(200).json(ret);
        } )
        .catch( err => {
            console.log(err);
        } )
}

function getTotalResidents(request, response) {

    let query = "select count(*) from resident";

    db.query( query )
        .then( res => {
            response.status(200).json(res[0]["count(*)"]);
        } )
        .catch( err => console.log(err) );
}

module.exports = { getResidentsAll, getTotalResidents };