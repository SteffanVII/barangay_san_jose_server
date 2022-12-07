const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");

const { db } = require("./mysqlConnect");

const { adminRoute } = require("./routes/adminRoute");
const { residentsRoute } = require("./routes/residentsRoute");
const { dashboardRoute } = require("./routes/dashboardRoute");

dotenv.config();

const app = express();

// Middlewares ...
app.use(cors({
    origin : ["http://localhost:3000", "http://localhost:3001"],
    credentials : true
}))
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieparser());

// Routes ...
app.use( "/residents", residentsRoute);
app.use( "/admin", adminRoute);
app.use( "/dashboard", dashboardRoute);

app.listen( 5000, () => {
    console.log("Listening to port : " + 5000 );
} )

const config = {
    host : '127.0.0.1',
    user : "root",
    password : "09064597123",
    database : "sanjose"
}

db.config(config);
db.connect();