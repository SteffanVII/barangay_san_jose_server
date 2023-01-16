const { db } = require("../mysqlConnect");

function getEvents( request, response ) {

    let query = `select * from \`events\` order by \`when\` desc`;

    db.query( query )
        .then( res => {
            response.status(200).json(res);
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } );

}

function addEvent( request, response ) {

    let data = request.body;

    console.log(data);

    let query = `insert into \`events\` (title, about, \`when\`) values(
                    "${data.title}",
                    "${data.about}",
                    '${data.date}'
                )`;

    db.query( query )
        .then( res => {
            response.status(200).json({ message : 'OK' });
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function updateEvent( request, response ) {

    let data = request.body;

    let query = `update \`events\` set title = "${data.title}", about = "${data.about}", \`when\` = '${data.date}' where id = ${data.id}`;

    db.query( query )
        .then( res => {
            response.status(200).json({ message : "OK" });
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function deleteEvent( request, response ) {

    let data = request.body;

    let query = `delete from \`events\` where id = ${data.id}`;

    db.query( query )
        .then( res => {
            response.status(200).json({ message : 'OK' });
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

module.exports = { getEvents, addEvent, updateEvent, deleteEvent };