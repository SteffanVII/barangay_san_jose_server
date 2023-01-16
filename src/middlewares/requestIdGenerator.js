const { db } = require("../mysqlConnect");

const chars = {
     1 : 'A',
     2 : '0',
     3 : 'B',
     4 : '1',
     5 : 'C',
     6 : '2',
     7 : 'D',
     8 : '3',
     9 : 'E',
    10 : '4',
    11 : 'F',
    12 : '5',
    13 : 'G',
    14 : '6',
    15 : 'H',
    16 : '7',
    17 : 'I',
    18 : '8',
    19 : 'J',
    20 : '9',
    21 : 'K',
    22 : 'L',
    23 : 'M',
    24 : 'N',
    25 : 'O',
    26 : 'P',
    27 : 'Q',
    28 : 'R',
    29 : 'S',
    30 : 'T',
    31 : 'U',
    32 : 'V',
    33 : 'W',
    34 : 'X',
    35 : 'Y',
    36 : 'Z',
}

async function generateRequestId( request, response, next ) {

    let f = true;
    let id = '';

    while( f ) {

        id = '';

        while( id.length < 5 ) {
            id += chars[Math.ceil(Math.random() * 36)];
        }

        let query = `select count(*) from \`requests\` where id=${f}`;

        await db.query( query )
            .then( res => {
                if ( parseInt(res['count(*)']) > 0 ) {
                    f = true;
                } else f = false;
            } )
            .catch( err => {
                console.log(err);
                response.status(400).send();
            } )

    }


    request["selectedId"] = id;
    
    next();
}

module.exports = { generateRequestId };