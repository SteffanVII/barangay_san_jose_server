const { db } = require("../mysqlConnect");

function fetchBanners( request, response ) {

    let query = `select * from \`announcements\` where live = 1 order by pos asc`;

    db.query( query )
        .then( res => {
            response.status(200).json(res);
        } )
        .catch( err => {
            response.status(400).send();
        } )

}

function fetchEvents( request, response ) {

    let query = `select * from \`events\` order by \`when\`desc`;

    db.query( query )
        .then( res => {
            console.log(res);
            response.status(200).json(res);
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function fetchUpcomingEvents( request, response ) {

    let query = `select * from \`events\` where \`when\` >= curdate() order by \`when\` desc`;

    db.query( query )
    .then( res => {
        response.status(200).json(res);
    } )
    .catch( err => {
        console.log(err);
        response.status(400).send();
    } );
}

module.exports = { fetchBanners, fetchEvents, fetchUpcomingEvents };