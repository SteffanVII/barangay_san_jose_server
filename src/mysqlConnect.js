const mysql2 = require("mysql2");

class DB {
    constructor() {
        this.connection;
    }

    config( config ) {
        this.connection = mysql2.createConnection(config);
    }

    connect() {
        this.connection.connect((err) => {
            if ( err ) console.log("Problem connecting to databse :" + err);
            else console.log("Database Connected");
        })
    }

    query( sql, arg ) {
        return new Promise((resolve, reject) => {
            this.connection.query( sql, arg, ( err, res ) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(res);
                }
            } )
        })
    } 
}

var db = new DB() ;

module.exports = { db };