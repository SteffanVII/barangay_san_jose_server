const multer = require("multer");
const path = require("path");

const diskLocation = multer.diskStorage({
    destination : ( req, file, callback ) => {
        callback( null, "public/banners" );

    },
    filename : ( req, file, callback ) => {
        let datetime = new Date().toISOString();
        let date = datetime.split("T")[0];
        let time = datetime.split("T")[1].split(".")[0].replaceAll( ":", "-" );
        let filename = `${path.parse(file.originalname).name}_${date}_${time}${path.extname(file.originalname)}`;
        callback( null, filename);
        file["datetime"] = datetime;
    }
});

const upload = multer({
    storage : diskLocation
});

module.exports = { upload };