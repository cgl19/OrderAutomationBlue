const Users = require("../models/Users");
const validator = require("validator");

exports.sanitizeData = (data) => {
	for (const key in data) {
		data[key] = validator.trim(data[key]);
		data[key] = validator.escape(data[key]);
	}
};

exports.generateRandomId = async () => {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var charactersLength = characters.length;

	for (var i = 0; i < 3; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	result += "-";
	result += Math.floor(100000 + Math.random() * 900000);

	return result;
};
