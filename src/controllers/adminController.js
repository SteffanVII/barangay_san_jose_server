const { db } = require("../mysqlConnect");
const jwt = require("jsonwebtoken");
const { GenerateToken } = require("../middlewares/security");

function authenticate( request, response ) {
    response.status(200).json({ status : "ok" });
}

function login( request, response ) {

    const { email, password } = request.body;

    const sql = "select * from admins where admins.email = ?";

    db.query( sql, [email] )
        .then( res => {
            response.status(200);
            if ( res.length > 0 ) {
                if ( res[0].password == password ) {
                    // Set jwt cookie
                    response.cookie("auth", GenerateToken(res[0]), {
                        httpOnly : true
                    });
                    // Set Admin cookie
                    response.cookie("admin", JSON.stringify({
                        email : res[0].email
                    }));
                    response.json({ status : "ok" });
                } else {
                    response.json({ status : "wrong password" });s
                }
            } else {
                response.status(200).json({ status : "invalid email" });
            }
        } )
        .catch( err => {
            console.log(err);
            response.status(400).send();
        });

    // mysqlConn.query( query, [ email ],( err, results, fields ) => {
    //     if ( !err ) {
    //         response.status(200);
    //         if ( results.length > 0 ) {
    //             if ( results[0].password == password ) {
    //                 // Set jwt cookie
    //                 response.cookie("auth", GenerateToken(results[0]), {
    //                     httpOnly : true
    //                 });
    //                 // Set Admin cookie
    //                 response.cookie("admin", JSON.stringify({
    //                     email : results[0].email
    //                 }));
    //                 response.json({ status : "ok" });
    //             } else {
    //                 response.json({ status : "wrong password" });
    //             }
    //         } else {
    //             response.status(200).json({ status : "invalid email" });
    //         }
    //     } else {
    //         response.status(400);
    //     }
    // } );
}

function logout( request, response ) {
    response.cookie("auth", "", {
        httpOnly : true
    });
    response.cookie ("admin", "");
    response.status(200).send();
}

module.exports = { login, authenticate, logout };