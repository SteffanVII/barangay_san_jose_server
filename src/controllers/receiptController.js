const { db } = require("../mysqlConnect");
const { monthsMap } = require("../utils");

function getReceipts( request, response ) {

    let query = `select * from \`receipts\` order by \`date\` desc`;

    db.query( query )
        .then( res => {
            response.status(200).json(res);
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } );

}

function addReceipt( request, response ) {

    let data = request.body;

    let query = `insert into \`receipts\` ( receipt_number, type, amount ) values( "${data.receipt_number}", "${data.type}", ${parseFloat(data.amount)} )`;

    db.query( query )
        .then( res => {
            response.status(200).json({ message : "OK" });
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function deleteReceipt( request, response ) {

    let data = request.body;

    console.log(data);

    let query = `delete from \`receipts\` where receipt_number = "${data.receipt_number}"`;

    db.query( query )
        .then(res => {
            response.status(200).json({message : "OK"});
        })
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function getFixedCounters( request, response ) {

    let thismonth = new Date();
    let lastmonth = new Date();
        lastmonth = new Date(lastmonth.setMonth(thismonth.getMonth() - 1));

    let lastyear = new Date();
        lastyear = new Date(lastyear.setFullYear(lastyear.getFullYear() - 1));

    let ret = {
        tmonth : 0,
        lmonth : 0,
        tyear : 0,
        lyear : 0,
        labels : {
            tmonth : monthsMap.get(parseInt(thismonth.getMonth() + 1)),
            lmonth : monthsMap.get(parseInt(lastmonth.getMonth() + 1)),
            tyear : thismonth.getUTCFullYear().toString(),
            lyear : lastyear.getUTCFullYear().toString()
        }
    }

    console.log(ret);

    let tmonthq = `select count(*) from \`receipts\` where MONTH(\`date\`) = ${parseInt(thismonth.getUTCMonth() + 1)} and YEAR(\`date\`) = ${thismonth.getUTCFullYear()}`;
    let lmonthq = `select count(*) from \`receipts\` where MONTH(\`date\`) = ${parseInt(lastmonth.getUTCMonth() + 1)} and YEAR(\`date\`) = ${lastmonth.getUTCFullYear()}`;
    let tyearq = `select count(*) from \`receipts\` where YEAR(\`date\`) = ${thismonth.getUTCFullYear()}`;
    let lyearq = `select count(*) from \`receipts\` where YEAR(\`date\`) = ${lastyear.getUTCFullYear()}`;

    db.query( tmonthq )
        .then( res => {
            ret.tmonth = res[0]["count(*)"];
            return db.query( lmonthq );
        } )
        .then( res => {
            ret.lmonth = res[0]["count(*)"];
            return db.query( tyearq );
        } )
        .then( res => {
            ret.tyear = res[0]["count(*)"];
            return db.query( lyearq );
        } )
        .then( res => {
            ret.lyear = res[0]["count(*)"];
            response.status(200).json(ret);
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}



module.exports = { getReceipts, addReceipt, deleteReceipt, getFixedCounters };