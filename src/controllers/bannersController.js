const { db } = require("../mysqlConnect");
const fs = require("fs");

function uploadBanner( request, response ) {

    let data = request.file;

    console.log(data);

    let query = `insert into \`announcements\` ( \`path\`, \`datetime\`, \`filename\` )
                    values( "${data.path.replaceAll("\\", "/").replace("public/", "")}",
                            '${data.datetime.replace("T", " ").replace("Z", "")}',
                            "${data.filename}"
                        )`;

    db.query( query )
        .then( res => {
            response.status(200).json({ message : "OK" });
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )
}

function getBanners( request, response ) {
    
    let query = `select * from \`announcements\` order by id desc`;

    let query2 = `select * from \`announcements\`
                            where live = 1 order by pos asc`;

    let ret = {
        result : [],
        total : 0,
        live : [],
        totalLive : 0
    }

    db.query( query )
        .then( res => {
            ret.result = res;
            ret.total = ret.result.length;
            
            return db.query( query2 );
        } )
        .then( res => {
            ret.live = res;
            ret.totalLive = ret.live.length;
            response.status(200).json(ret);
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } )

}

function updateStatus( request, response ) {

    let data = request.body;

    console.log(data);

    let query = `select count(*) from \`announcements\` where live = 1`;

    let live = 0;

    db.query( query )
        .then( res => {
            live = res[0]["count(*)"];

            let query2 = `update \`announcements\`
                                set live = ${data.live} ${data.live === 1 ? `,pos = ${live + 1}` : `,pos = -1`}
                                where \`announcements\`.id = ${data.id}`;

            return db.query(query2);
        } )
        .then( res => {
            if ( data.status === 0 ) {
                return db.query( `select * from \`announcements\` where live = 1 order by pos asc` );
            } else {
                response.status(200).json({ message : "OK" });
            }
        } )
        .then( res => {
            if ( data.status === 0 ) {
                let live = res;
                live.forEach( async ( element, index ) => {
                    await db.query( `update \`announcements\` set pos = ${index + 1} where id = ${element.id}` );
                });
                response.status(200).json({ message : "OK" });
            }
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        } );
}

function repositionBanners( request, response ) {

    let banners = request.body;

    console.log(banners);

    banners.forEach( async ( e, i ) => {
        try {
            await db.query( `update \`announcements\` set pos = ${i + 1} where id = ${e.id}` );
        } catch ( err ) {
            console.log(err);
            response.status(400).send();
            return;
        }
    } );

    response.status(200).json({ message : "OK" });
}

function deleteBanner( request, response ) {

    let data = request.body;

    let query = `delete from \`announcements\`
                        where id = ${data.id}`;

    fs.unlink( `public\\` + data.path, ( err ) => {
        db.query( query )
                .then( res => {
                    if ( data.live === 1 ) {
                        return db.query( `select * from \`announcements\` where live = 1 order by pos asc` );
                    } else {
                        response.status(200).json({ message : "OK" });
                    }
                } )
                .then( res => {
                    if ( data.live === 1 ) {
                        let live = res;
                        live.forEach( async ( element, index ) => {
                            await db.query( `update \`announcements\` set pos = ${index + 1} where id = ${element.id}` );
                        });
                        response.status(200).json({ message : "OK" });
                    }
                } )
                .catch( err => {
                    console.log(err);
                    response.status(400).send();
                } );
    });


}

module.exports = { uploadBanner, getBanners, updateStatus, deleteBanner, repositionBanners };