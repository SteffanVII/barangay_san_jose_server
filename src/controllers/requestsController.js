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

    let ret;

    db.query( query )
        .then( res => {

            ret = res[0]

            if ( parseInt(res[0].type) === 0 ) {

                let q = `select * from \`barangay_clearance_request_info\` where id = "${params.id}"`;

                return db.query( q )
                        .then( res => {
                            ret["purok"] = res[0].purok;
                            ret["purpose"] = res[0].purpose;
                        } );
            }
            else if ( parseInt(res[0].type) === 1 ) {
                let q = `select * from \`bussiness_permit_request_info\` where id = "${params.id}"`;

                return db.query( q )
                        .then( res => {
                            ret["bussiness_name"] = res[0].bussiness_name;
                            ret["bussiness_address"] = res[0].bussiness_address;
                            ret["bussiness_description"] = res[0].bussiness_description;
                        } );
            }
            else {
                return;
            }
        } )
        .then( res => {
            response.status(200).json(ret);
        } )
        .catch( err => {
            console.log(err);
            response.status(400);
            response.send();
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

    let query = `insert into \`requests\` ( id, name, type,  phone, email ) 
                    values( "${id}", "${name}", ${data.type},  "${data.phone}", "${data.email}" );
    `;

    if ( parseInt(data.type) === 0 ) {

        db.query( query )
            .then( res => {
                let query = `insert into \`barangay_clearance_request_info\` ( id, purpose, purok )
                                values( "${id}", "${data.purpose}", ${data.purok} )`;
                return db.query( query );
            } )
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
                let query = `insert into \`bussiness_permit_request_info\` ( id, bussiness_name, bussiness_address, bussiness_description )
                                values( "${id}", "${data['bussiness_name']}", "${data['bussiness_address']}", "${data['bussiness_description']}" )
                `
                return db.query( query );
            } )
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