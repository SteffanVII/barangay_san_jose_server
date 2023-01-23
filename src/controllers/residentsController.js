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

    let query = "select * from resident";

    let conds = [];

    if ( p.firstname ) {
        conds.push(`\`resident\`.fname like "%${p.firstname}%"`);
    }
    if ( p.lastname ) {
        conds.push(`\`resident\`.lname like "%${p.lastname}%"`);
    }
    if ( p.middlename ) {
        conds.push(`\`resident\`.mname like "%${p.middlename}%"`);
    }

    if ( p.age ) {
        // conds.push(`\`resident\`.age = ${parseInt(p.age)}`);
        conds.push(`date_format(from_days(datediff(now(), \`resident\`.bdate)), '%Y') + 0 = ${parseInt(p.age)} `);
    }

    if ( p.agemin || p.agemax ) {
        conds.push(`date_format(from_days(datediff(now(), \`resident\`.bdate)), '%Y') + 0 >= ${parseInt(p.agemin)} and date_format(from_days(datediff(now(), \`resident\`.bdate)), '%Y') + 0 <= ${parseInt(p.agemax)}`);
    }

    if ( p.gender ) {
        conds.push(`\`resident\`.gender = ${parseInt(p.gender)}`);
    }

    if ( p.purok ) {
        conds.push(`\`resident\`.purok = ${parseInt(p.purok)}`);
    }

    query = db.concatConditions( conds, query );

    query += ` limit ${parseInt(p.entries)} offset ${parseInt( ( p.page - 1 ) * p.entries )}`;

    db.query( query, [ parseInt(p.entries), parseInt((p.page - 1) * p.entries) ] )
        .then( res => {
            ret.entries = res;
            ret.currentPage = p.page;

            let query2 = db.concatConditions( conds, `select count(*) from resident ` );

            return db.query( query2 );
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

function registerResident( request, response ) {

    let body = request.body;

    console.log(body);

    let query = `insert into \`resident\` ( \`resident\`.fname, \`resident\`.lname, \`resident\`.mname, \`resident\`.suffix, \`resident\`.gender, \`resident\`.bdate, \`resident\`.address, \`resident\`.purok, \`resident\`.contact_no, \`resident\`.house_no, \`resident\`.registered, \`resident\`.religion, \`resident\`.email, \`resident\`.birthplace, \`resident\`.civil_status ) values
                    ( "${body.fname}", "${body.lname}", "${body.mname}", "${body.suffix}", ${body.gender}, '${(body.bdate === '' ? `NULL` : `${body.bdate}`)}', "${body.address}", ${(body.purok === '' ? `NULL` : body.purok)}, "${body.contact}", ${(body.house === '' ? `NULL` : body.house)}, ${body.registered}, "${body.religion}", "${body.email}", "${body.birthplace}", "${body.status}" )`;

    db.query( query )
            .then( res => {
                response.status(200).send();
            } )
            .catch( err => {
                console.log(err);
                response.status(400).send();
            } )

}

function updateResident( request, response ) {

    let body = request.body;

    let query = `update \`resident\` set 
                    \`resident\`.fname = "${body.fname}",
                    \`resident\`.lname = "${body.lname}",
                    \`resident\`.mname = "${body.mname}",
                    \`resident\`.suffix = "${body.suffix}",
                    \`resident\`.gender = ${body.gender},
                    \`resident\`.bdate = '${(body.bdate === '' ? `NULL` : body.bdate)}',
                    \`resident\`.address = '${body.address}',
                    \`resident\`.purok = ${(body.purok === '' ? `NULL` : body.purok)},
                    \`resident\`.contact_no = "${body.contact}",
                    \`resident\`.house_no = ${(body.house === '' ? `NULL` : body.house)},
                    \`resident\`.registered = ${body.registered},
                    \`resident\`.religion = "${body.religion}",
                    \`resident\`.email = "${body.email}",
                    \`resident\`.birthplace = "${body.birthplace}",
                    \`resident\`.civil_Status = "${body.status}"
                    where \`resident\`.id = ${body.id}
                    `

    db.query( query )
            .then( res => {
                response.status(200).send();
            } )
            .catch( err => {
                console.log(err);
                response.status(400).send();
            } )

}

module.exports = { getResidentsAll, getTotalResidents, registerResident, updateResident };