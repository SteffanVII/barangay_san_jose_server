const { db } = require("../mysqlConnect");

function getDashboardInfo( request, response ) {

    const details = {
        residentsCount : 0
    };

    db.query( "select count(*) from resident" )
        .then( res => {
            details.residentsCount = res[0]["count(*)"];
            response.status(200).json(details);
        } )
        .catch( err => console.log(err) );
}

module.exports = { getDashboardInfo };