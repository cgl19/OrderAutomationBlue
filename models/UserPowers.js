"use strict";
const { Model } = require("sequelize");
const { DistiVendorList } = require("./index");

module.exports = (sequelize, DataTypes) => {
	class UserPowers extends Model {}

	UserPowers.init(
		{
			UserId: DataTypes.INTEGER,
			PowerId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "UserPowers",
		}
	);

	UserPowers.associate = (models) => {
		// associations can be defined here
		UserPowers.hasMany(models.Users, {
			sourceKey: "UserId",
			foreignKey: "id",
		});

		UserPowers.hasMany(models.Powers, {
			sourceKey: "PowerId",
			foreignKey: "id",
		});
	};

	return UserPowers;
};
