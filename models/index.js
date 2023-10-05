// This file should not be modified
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

// const sequelize = new Sequelize('vcloudtechus_cms', 'vcloudtechus_cms', ';WQZEJoFSSTY', {
//     omitNull : false,
//     host: 'localhost',
//     dialect: 'mysql',
//     dialectOptions: {
//       options: {
//         requestTimeout: 5000
//       }
//     },
//     pool: {
//       max: 120,
//       min: 0,
//       idle: 3000
//     },
// });


const sequelize = new Sequelize('orderAutomationRefactor', 'orderAutomationRefactor', 'refactor@123', {
	host: "127.0.0.1",
	dialect: "mysql",
	dialectOptions: {
		options: {
			requestTimeout: 5000,
		}, 
	},
	pool: {
		max: 120,
		min: 0,
		idle: 3000,
	},
});

try {
	sequelize.authenticate();
	console.log("Database Connected.");
} catch (error) {
	console.error("Unable to connect to the database:", error);
}

fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
		);
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes
		);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
