const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");

const { db } = require("./mysqlConnect");

const { adminRoute } = require("./routes/adminRoute");
const { residentsRoute } = require("./routes/residentsRoute");
const { dashboardRoute } = require("./routes/dashboardRoute");
const { requestsRoute } = require("./routes/requestsRoute");
const { blottersRoute } = require("./routes/blottersRoute");
const { bannersRoute } = require("./routes/bannersRoute");
const { publicRoute } = require("./routes/publicRoute");
const { eventsRoute } = require("./routes/eventsRoute");
const { receiptRoute } = require("./routes/receiptRoute");

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
app.use( "/requests", requestsRoute);
app.use( "/blotters", blottersRoute );
app.use( "/banners", bannersRoute );
app.use( "/public", publicRoute );
app.use( "/events", eventsRoute );
app.use( "/receipts", receiptRoute );

app.use( "/serve", express.static( process.env.STATIC_PATH ) );

app.listen( process.env.PORT, () => {
    console.log("Listening to port : " + process.env.PORT );
} )

const config = {
    host : '127.0.0.1',
    user : "root",
    password : "09064597123",
    database : "sanjose"
}

db.config(config);
db.connect();