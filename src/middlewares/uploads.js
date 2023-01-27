const multer = require("multer");
const path = require("path");
const { default: MulterGoogleCloudStorage } = require("multer-google-storage");
const { Storage } = require("@google-cloud/storage");

// const diskLocation = multer.diskStorage({
//     destination : ( req, file, callback ) => {
//         callback( null, "public/banners" );
//     },
//     filename : ( req, file, callback ) => {
//         let datetime = new Date().toISOString();
//         let date = datetime.split("T")[0];
//         let time = datetime.split("T")[1].split(".")[0].replaceAll( ":", "-" );
//         let filename = `${path.parse(file.originalname).name}_${date}_${time}${path.extname(file.originalname)}`;
//         callback( null, filename);
//         file["datetime"] = datetime;
//     }
// });

const memoryLocation = multer.memoryStorage();

const gcsStorage = new Storage({
    projectId : "glowing-reserve-375711",
    keyFilename : path.join( __dirname, "../glowing-reserve-375711-6d06310ec484.json" )
});

const bucket = gcsStorage.bucket("san_jose__bucket");

const gcsUploadHandle = new MulterGoogleCloudStorage({
        autoRetry : true,
        bucket : "san_jose__bucket",
        projectId : "glowing-reserve-375711",
        keyFilename : path.join( __dirname, "../glowing-reserve-375711-6d06310ec484.json" ),
        filename : ( req, file, callback ) => {
            let datetime = new Date().toISOString();
            let date = datetime.split("T")[0];
            let time = datetime.split("T")[1].split(".")[0].replaceAll( ":", "-" );
            let filename = `${path.parse(file.originalname).name}_${date}_${time}${path.extname(file.originalname)}`;
            callback( null, filename);
            file["datetime"] = datetime;
        }
    })

const upload = multer({
    storage : memoryLocation
});

module.exports = { upload, bucket };