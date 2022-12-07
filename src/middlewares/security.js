const jwt = require("jsonwebtoken");

function Protect( request, response, next ) {
    try {
        const verify = jwt.verify( request.cookies.auth, process.env.JWT_SECRET );
        request.user = {
            email : verify.email,
            password :verify.password
        };
        next();
    } catch (error) {
        response.status(200).json({ status : "error" });
    }
}

function GenerateToken( payload ) {
    return jwt.sign( payload, process.env.JWT_SECRET, {
        expiresIn : "30min"
    } )
}

module.exports = { GenerateToken, Protect };