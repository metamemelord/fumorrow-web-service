const cloudinary = require("../../media").cloudInstance;
const urlBuilder = require("../mediaUrlBuilder");
const filename = require("path").basename(__filename);
const logger = require("../../../../Loggers").LoggerFactory.getLogger(filename);

function upload(imageDetails, callback) {
	try {
		var publicId = urlBuilder(imageDetails);
		cloudinary.v2.uploader.upload(imageDetails.path,
			{ resource_type: "image", cloud_name: "fumedia", public_id: publicId },
			function (error, data) {
				if (error) {
					logger.error(error);
					return callback(500, "Cannot upload at the moment", null);
				} else {
					var result = {
						"width": data.width,
						"height": data.height,
						"format": data.format,
						"resource_type": data.resource_type,
						"created_at": data.created_at,
						"url": data.url,
						"secure_url": data.secure_url,
					};
					return callback(201, "Ok", result);
				}
			});
	} catch (error) {
		logger.error(error);
		return callback(500, "Internal server error", null);
	}
}

module.exports = upload;
