const jwt = require("jsonwebtoken");

function Protect( request, response, next ) {
    try {
        const verify = jwt.verify( request.cookies.__session, process.env.JWT_SECRET );
        request.user = {
            email : verify.email,
            password :verify.password
        };
        if ( parseInt(verify.exp) - 900000 > Date.now() ) {
            response.cookie("__session", GenerateToken( {
                email : verify.email,
                password : verify.password,
                name : verify.name,
                created_at : verify.created_at
            } ), {
                httpOnly : true
            });
        }
        next();
    } catch (error) {
        response.status(200).json({ status : "timeout", err : error  });
    }
}

function GenerateToken( payload ) {
    return jwt.sign( payload, process.env.JWT_SECRET, {
        expiresIn : "30min"
    } )
}

module.exports = { GenerateToken, Protect };