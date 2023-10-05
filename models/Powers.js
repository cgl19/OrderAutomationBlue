"use strict";
const { Model } = require("sequelize");
const { DistiVendorList } = require("./index");

module.exports = (sequelize, DataTypes) => {
	class Powers extends Model {}

	Powers.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [3, 30],
					notEmpty: true,
				},
			},
			status: {
				type: DataTypes.ENUM,
				values: ["active", "inactive", "blocked"],
				defaultValue: "active",
			},
		},
		{
			sequelize,
			modelName: "Powers",
		}
	);

	Powers.associate = (models) => {
		// associations can be defined here
		Powers.belongsToMany(models.Users, { through: models.UserPowers });
	};

	return Powers;
};
