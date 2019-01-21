const decrypt = require("../../lib/Security/EncryptionDecryption").decrypt;
module.exports = (req, res, next) => {
	const token = req.header("authorization");
	const decryptedToken = decrypt(token);
	if (token === undefined) {
		return res.status(403).json({
			status: {
				code: 403,
				message: "Unauthorized access"
			},
			data: null
		});
	} else if (decryptedToken === null) {
		return res.status(403).json({
			status: {
				code: 403,
				message: "Invalid token"
			},
			data: null
		});
	} else {
		req.token = decryptedToken;
		next();
	}
};
