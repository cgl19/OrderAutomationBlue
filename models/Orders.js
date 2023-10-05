"use strict";
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
	class Orders extends Model {}

	Orders.init(
		{
      amazonComments: {
				type: DataTypes.STRING,
				allowNull: true,
			
			},
      category: {
				type: DataTypes.STRING,
				allowNull: true,
			
			},
      accountComments: {
				type: DataTypes.STRING,
				allowNull: true,
				
			},
			amazonAccount: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					
					notEmpty: true,
				},
			},
            orderId: {
				type: DataTypes.STRING,
				allowNull: true,
        unique:true,
				validate: {
					
					notEmpty: true,
				},
			},
      poNumber: {
				type: DataTypes.STRING,
				allowNull: true,
        unique:true
				
			},
            shipBy: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					
					notEmpty: true,
				},
			},
            deliverBy: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					
					notEmpty: true,
				},
			},
            contactBuyer: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					
					notEmpty: true,
				},
			},
            customerType: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					
					notEmpty: true,
				},
			},
            mfrName: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					
					notEmpty: true,
				},
			},
            sku: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					
					notEmpty: true,
				},
			},
            quantity: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					
					notEmpty: true,
				},
			},
            orderDate: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
            orderDateAccount: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              filename: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              productChargesAudit: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              amazonFeeAudit: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              shippingAudit: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              refundAudit: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              extrafeeAudit: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              rfc: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING reason for cancellation
                allowNull: true,
              },
              cancellationType: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING reason for cancellation
                allowNull: true,
              },
              price: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              tax: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              shippingFee: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              amazonFee: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              mft: {
                type: DataTypes.STRING,
                allowNull: true,
              },
               yourEarning: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              cost: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              freightCost: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              handlingFee: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              shippingAddress: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              shippingDiscount: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              addressType: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              distributor: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              purchaseDate: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              phone: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              paymentTerm: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              companyPhone: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              email: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              amazonUserId: {
                type: DataTypes.INTEGER, // Assuming your Users model uses INTEGER as tamazahe primary key
                allowNull: true, // Allow null since either Amazon user or Account user can be associated
              },
              accountUserId: {
                type: DataTypes.INTEGER, // Assuming your Users model uses INTEGER as the primary key
                allowNull: true, // Allow null since either Amazon user or Account user can be associated
              },
              assignedDate: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              inProgressDate: {
                type: DataTypes.DATE, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              completeOrCancelDate: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              CancelDate: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              processedAccount: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              poSixSeries: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              latestNo: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              invoiceNo: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              cfc: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING Comment FOr Cancellation
                allowNull: true,
              },
              billNo: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              invoiceDate: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              billDate: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              insurance: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              saleTax: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              creditMemo: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              miscFee: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              resoldRevenue: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              trackingNo: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              poDate: {
                type: DataTypes.DATE, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              deliveredDate: {
                type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.STRING
                allowNull: true,
              },
              rating: {
                type: DataTypes.FLOAT, // Use DataTypes.STRING instead of DataTypes.STRING
                defaultValue:0,
              },
			status: {
				type: DataTypes.ENUM,
				values: ["pending","assigned", "cancelled", "in-progress", "completed","on-hold"],
				defaultValue: "pending",
			},
			verificationStatus: {
				type: DataTypes.ENUM,
				values: ["verified","not-verified"],
				defaultValue: "not-verified",
        allowNull : true,
			},
		},
		{
			sequelize,
			modelName: "Orders",
		}
	);

    Orders.associate = (models) => {
        // Update the association to one-to-many
        Orders.belongsTo(models.Users, { foreignKey: "amazonUserId", as: "amazonUser" });
    Orders.belongsTo(models.Users, { foreignKey: "accountUserId", as: "accountUser" });
      };

	return Orders;
};
