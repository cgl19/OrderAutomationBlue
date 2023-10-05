"use strict";
const { Model } = require("sequelize");
const { DistiVendorList } = require("./index");

module.exports = (sequelize, DataTypes) => {
	class Users extends Model {}

	Users.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [3, 30],
					notEmpty: true,
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [5, 50],
					notEmpty: true,
				},
				unique: true,
			},
			
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [60, 72],
					notEmpty: true,
				},
			},
			role: {
				type: DataTypes.ENUM,
				values: ["admin", "employee"],
			},
			status: {
				type: DataTypes.ENUM,
				values: ["active", "inactive", "blocked"],
				defaultValue: "active",
			},
		},
		{
			sequelize,
			modelName: "Users",
		}
	);

	Users.associate = (models) => {
		// associations can be defined here
		

		

		

		Users.belongsToMany(models.Powers, { through: models.UserPowers });
		Users.hasMany(models.Orders, { foreignKey: "amazonUserId", as: "amazonOrders" });

		// Update the association to one-to-many with Orders as "accountUser"
		Users.hasMany(models.Orders, { foreignKey: "accountUserId", as: "accountOrders" });
	
	};

	return Users;
};
