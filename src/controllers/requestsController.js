const { db } = require("../mysqlConnect");

// Get All request
function getRequestList( request, response ) {

    let params = request.query;
    let query = `select id, type, req_date, name, status from \`requests\``;
    let cond = [];

    if ( params.type != "default" ) cond.push(`\`type\` = ${params.type}`);

    if ( params.status == "admin" ) {
        cond.push(`\`status\` = 1 and \`processed_by\` = "${request.user.email}"`);
    } else {
        cond.push(`\`status\` = ${params.status}`);
    }

    if ( params.searchvalue !== "" ) {
        if ( params.searchtype === "id" ) {
            cond.push(`\`id\` = "${params.searchvalue}"`);
        } else {
            cond.push(`\`name\` like "%${params.searchvalue}%"`);
        }
    }

    query = db.concatConditions( cond, query );

    query += ` order by req_date desc`;

    db.query( query )
        .then( res => {
            response.status(200).json(res);
        })
        .catch( err => {
            console.log(err);
            response.status(400);
            response.send();
        })

}

// Get request info
function getRequestInfo( request, response ) {

    let params = request.query; 
    let query = `select * from \`requests\` where \`id\` = "${params.id}"`;

    db.query( query )
        .then( res => {
            response.status(200).json(res);
        } )
        .catch( err => {
            console.log(err);
            response.status(400);
            response.sends();
        } )

}

function changeRequestStatus( request, response ) {

    let params = request.query;
    let cond = [];

    let query = `update requests set status = ${params.statusTo}`; 

    if ( parseInt(params.statusTo) === 1 ) {
        query += `, \`processed_by\` = "${request.user.email}"`;
    }

    query += `  where id = "${params.id}"`;

    console.log(query);

    db.query( query )
        .then( res => {
            response.status(204).send();
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function registerRequest( request, response ) {

    let data = request.body;
    let id = request.selectedId;

    let name = `${data.lastname}, ${data.firstname} ${data.middlename}`;
    let date = new Date();
    let yyyy = date.getFullYear();
    let mm =  (date.getMonth() + 1).toString();
    if ( mm.length < 2 ) {
        mm = `0${mm}`;
    }
    let dd = date.getDate().toString();
    if ( dd.length < 2 ) {
        dd = `0${dd}`;
    }
    let req_date = `${yyyy}-${mm}-${dd}`;

    let query = `insert into \`requests\` ( id, name, type,  phone, email ) 
                    values( "${id}", "${name}", ${data.type},  "${data.phone}", "${data.email}" );
    `;

    if ( parseInt(data.type) === 0 ) {

        db.query( query )
            .then( res => {
                response.status(200).json( { id : id } );
            } )
            .catch( err => {
                console.log(err);
                response.status(400).send();
            } )
            
    }
    else if ( parseInt(data.type) === 1 ) {
        db.query( query )
            .then( res => {
                response.status(200).json( { id : id } );
            } )
            .catch( err => {
                console.log(err);
                response.status(400).send();
            } )
    }
    else if ( parseInt(data.type) === 2 ) {
        db.query( query )
            .then( res => {
                response.status(200).json( { id : id } );
            } )
            .catch( err => {
                console.log(err);
                response.status(400).send();
            } )
    }
    else if ( parseInt(data.type) === 3 ) {
        db.query( query )
            .then( res => {
                response.status(200).json( { id : id } );
            } )
            .catch( err => {
                console.log(err);
                response.status(400).send();
            } )
    }

}

function checkRequestStatus( request, response ) {

    let id = request.body.id;

    let query = `select * from \`requests\` where id = "${id}"`
    console.log(id);

    db.query( query )
        .then( res => {
            if ( res.length > 0 ) {
                response.status(200).json(res[0]);
            } else {
                response.status(200).json({ message : "The id doesn't exist." });
            }
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

module.exports = { getRequestList, getRequestInfo, changeRequestStatus, registerRequest, checkRequestStatus };