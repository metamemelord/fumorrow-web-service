"use strict";

const crypto = require("crypto");
const md5 = require("md5");

const ENCRYPTION_KEY = md5(process.env.ENCRYPTION_KEY);
const IV_LENGTH = 16;

function encrypt(text) {
	try {
		let iv = crypto.randomBytes(IV_LENGTH);
		let cipher = crypto.createCipheriv("aes-256-cbc", new Buffer(ENCRYPTION_KEY), iv);
		let encrypted = cipher.update(text);
      
		encrypted = Buffer.concat([encrypted, cipher.final()]);
      
		return iv.toString("hex") + ":" + encrypted.toString("hex");
	} catch(e) {
		return null;
	}
}

function decrypt(text) {
	try {
		let textParts = text.split(":");
		let iv = new Buffer(textParts.shift(), "hex");
		let encryptedText = new Buffer(textParts.join(":"), "hex");
		let decipher = crypto.createDecipheriv("aes-256-cbc", new Buffer(ENCRYPTION_KEY), iv);
		let decrypted = decipher.update(encryptedText);
      
		decrypted = Buffer.concat([decrypted, decipher.final()]);
      
		return decrypted.toString();
	} catch(e) {
		return null;
	}
}

module.exports = { decrypt, encrypt };