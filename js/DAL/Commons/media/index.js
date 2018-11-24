const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.MEDIA_CLOUD_NAME,
    api_key: process.env.MEDIA_CLOUD_API_KEY,
    api_secret: process.env.MEDIA_CLOUD_API_SECRET
});

function upload(mediaDetails, callback) {
    require('./lib/AbstractUploadStrategy').upload(mediaDetails, callback)
}

module.exports = {
    cloudInstance: cloudinary,
    upload
};
