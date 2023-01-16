const { db } = require("../mysqlConnect");

function getBlottersList( request, response ) {

    const params = request.query;

    let blottersQuery = `select distinct \`blotters\`.case_no, \`blotters\`.filed_date, \`blotters\`.status
                    from \`blotters\``;

    let blottersTotalResults = `select distinct count(*)
                    from \`blotters\``;

    let conds = [];

    // Check case status if open or closed
    if ( params.status === "open" ) {
        conds.push(`\`status\` = 0`);
    }
    else if ( params.status === "closed" ) {
        conds.push(`\`status\` = 1`);
    }

    if ( params.searchvalue !== "" ) {
        if ( params.searchtype === "caseno" ) {
            // Searching by Case number
            let i =  isNaN(parseInt(params.searchvalue)) ? -1 : parseInt(params.searchvalue);
            conds.push(`\`case_no\` = ${i}`);
        } else {
            // Searching by name invlove
            blottersQuery += ` inner join \`blotter_individuals\`
                                on \`blotter_individuals\`.case_no = \`blotters\`.case_no and \`blotter_individuals\`.name like "%${params.searchvalue}%"`;

            blottersTotalResults += ` inner join \`blotter_individuals\`
                                        on \`blotter_individuals\`.case_no = \`blotters\`.case_no and \`blotter_individuals\`.name like "%${params.searchvalue}%"`;
        }
    }

    blottersQuery = db.concatConditions( conds, blottersQuery );

    let limit = 30 + parseInt(params.offset);

    blottersQuery += ` order by \`blotters\`.case_no ${params.order} limit ${limit}`;

    blottersTotalResults = db.concatConditions( conds, blottersTotalResults );

    let ret = { 
        totalResults : 0,
        results : []
    };

    db.query( blottersQuery )
        .then( async res => {
            let arr = [];

            // console.log(res);

            // Get the people invloved in the blotter
            await res.forEach( c => {

                let getIndividualQuery = `select \`blotter_individuals\`.name, \`blotter_individuals\`.type
                                    from\`blotter_individuals\`
                                    where \`blotter_individuals\`.case_no = ${c.case_no}`

                db.query( getIndividualQuery )
                    .then( r => {
                        c["individuals"] = r;
                        arr.push(c)
                    } )
            } );

            ret.results = arr;
            return db.query( blottersTotalResults );
        } )
        .then ( res => {
            // Get total results
            ret.totalResults = res[0]["count(*)"];
            response.status(200).json(ret);
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )
                
}

function getBlotterInfo( request, response ) {

    const params = request.query;

    let ret;

    console.log(params);

    db.query( `select * from \`blotters\` where \`blotters\`.case_no = ${params.case}` )
        .then( res => {
            ret = res;
            return db.query( `select name, type from \`blotter_individuals\` where \`blotter_individuals\`.case_no = ${params.case}` );
        } )
        .then ( res => {
            ret[0]["individuals"] = res;
            response.status(200).json(ret);
        } )
        .catch ( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function updateBlotterInfo( request, response ) {

    const body = request.body;

    const query = `update \`blotters\`
                    set \`blotters\`.complaint = "${body.complaint}", \`blotters\`.incident_date = "${body.incidenttimeline.split("T")[0]}", \`blotters\`.time = "${body.incidenttimeline.split("T")[1].split("Z")[0]}", \`blotters\`.status = ${body.status}
                    where \`blotters\`.case_no = ${body.case_no}`;

    const query2 = `delete from \`blotter_individuals\`
                            where \`blotter_individuals\`.case_no = ${body.case_no}`;

    let query3 = `insert into \`blotter_individuals\` values `;

    db.query( query )
        .then( res => {
            if ( Boolean(body.individuals.length) ) {
                return db.query( query2 );
            }
        } )
        .then( res => {

            if ( body.individuals.length > 0 ) {
                body.individuals.forEach( e => {
                    if ( body.individuals.indexOf(e) === 0 ) {
                        query3 += `( ${body.case_no}, ${parseInt(e.type)}, "${e.name}" )`;
                    } else {
                        query3 += `,( ${body.case_no}, ${parseInt(e.type)}, "${e.name}" )`;
                    }
    
                } )
    
                return db.query( query3 );
            } else {
                response.status(200).send();
            }
        } )
        .then( res => {
            response.status(200).send();
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function deleteBlotter( request, response ) {

    const caseno = request.query.caseno;

    const query = `delete from \`blotters\`
                            where \`blotters\`.case_no = ${caseno}`;

    const query2 = `delete from \`blotter_individuals\`
                            where \`blotter_individuals\`.case_no = ${caseno}`;

    db.query( query )
        .then( res => {
            return db.query( query2 );
        } )
        .then( res => {
            response.status(200).send();
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function registerBlotter( request, response ) {

    let body = request.body;

    let query = `select * from \`blotters\`
                            where \`blotters\`.case_no = ${body.case_no}`;

    let query2;

    if ( body.filed_date === "default" ) {
        query2 = `insert into \`blotters\` ( \`case_no\`, \`status\`, \`incident_date\`, \`time\`, \`complaint\` )
                        values ( DEFAULT, ${parseInt(body.status)}, "${body.incident_date.split("T")[0]}", "${body.incident_date.split("T")[1].split("Z")[0]}", "${body.complaint}" )`;
    } else {
        query2 = `insert into \`blotters\` ( \`case_no\`, \`status\`, \`incident_date\`, \`time\`, \`complaint\`, \`filed_date\` )
                       values ( DEFAULT, ${parseInt(body.status)}, "${body.incident_date.split("T")[0]}", "${body.incident_date.split("T")[1].split("Z")[0]}", "${body.complaint}", "${body.filed_date}" )`;
    }

    let query3 = `select * from \`blotters\` where \`blotters\`.case_no =  `;

    let query4 = `insert into \`blotter_individuals\` ( \`case_no\`, \`type\`, \`name\` ) values`;

    let query5 = `select * from \`blotter_individuals\` where \`blotter_individuals\`.case_no =  `;

    let ret;

    if ( body.case_no !== "default" ) {
        db.query( query )
                .then( res => {
                    if ( !Boolean(res.length) ) {
                        return db.query( query2 );
                    } else {
                        response.status(409).send();
                    }
                } )
                .then( res => {
                    query3 += res.insertId;
                    return db.query( query3 );
                } )
                .then( res => {

                    ret = res[0];

                    if ( body.individuals.length > 0 ) {
                        body.individuals.forEach( e => {
                            if ( body.individuals.indexOf(e) === 0 ) {
                                query4 += `( ${ret.case_no}, ${e.type}, "${e.name}" )`;
                            } else {
                                query4 += `,( ${ret.case_no}, ${e.type}, "${e.name}" )`;
                            }
                        } )
        
                        return db.query( query4 );
                    } else {
                        ret["individuals"] = [];
                        response.status(200).json(ret);
                    }
    
                } )
                .then( res => {
                    query5 += `${ret.case_no}`;
                    return db.query( query5 );
                } )
                .then( res => {
                    ret["individuals"] = res;
                    console.log(ret);
                    response.status(200).json(ret);
                } )
                .catch( err => {
                    console.log(err);
                    response.status(400).send();
                } );
    } else {
        db.query( query2 )
                .then( res => {
                    query3 += res.insertId;
                    return db.query( query3 );
                } )
                .then( res => {
                    ret = res[0];

                    if ( body.individuals.length > 0 ) {
                        body.individuals.forEach( e => {
                            if ( body.individuals.indexOf(e) === 0 ) {
                                query4 += `( ${ret.case_no}, ${e.type}, "${e.name}" )`;
                            } else {
                                query4 += `,( ${ret.case_no}, ${e.type}, "${e.name}" )`;
                            }
                        } )
        
                        return db.query( query4 );
                    } else {
                        ret["individuals"] = [];
                        response.status(200).json(ret);
                    }
    
                } )
                .then( res => {
                    query5 += `${ret.case_no}`;
                    return db.query( query5 );
                } )
                .then( res => {
                    ret["individuals"] = res;
                    response.status(200).json(ret);
                } )
                .catch( err => {
                    console.log(err);
                    response.status(400).send();
                } );

    }



}

module.exports = { getBlottersList, getBlotterInfo, updateBlotterInfo, deleteBlotter, registerBlotter };