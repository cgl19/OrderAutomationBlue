// const bcrypt = require("bcryptjs");
// const db = require("../models");
// const helpers = require("../helpers/helpers");
// const validator = require("validator");
// const e = require("connect-flash");
// const nodemailer = require('nodemailer');
// const fileUpload = require('express-fileupload');
// const path = require('path');
// const { json } = require("body-parser");
// const { Orders,Users,Powers,UserPowers } = db;
// const { Op, where } = require("sequelize");
// const createCsvWriter = require("csv-writer").createObjectCsvWriter;
// const fs = require("fs");
// const express = require('express');
// const readXlsxFile = require("read-excel-file/node");
// const excel = require('exceljs');
// const { log } = require("console");











// exports.root = async (req, res) => {
// 	//console.log(req.session.user)
// 	const searchName = 'accounts'; // The value you want to search for

//     const foundPower = req.session.user.Powers.find(power => power.name === searchName);
// 	if (foundPower){
// 		res.redirect("/employee/account")
// 	}
	


// 	try {
// 		const userId = req.session.user.id;
		
// 		const assigned = await Orders.findAll({
// 		  where: {
			
// 			[Op.or]: [
// 				{ amazonUserId: userId },
// 				{ accountUserId: userId }
// 			  ]
			
// 		  }
// 		});
// 		const completedOrders = await Orders.findAll({
// 			where: {
// 			  [Op.and]: [
// 				{
// 				  [Op.or]: [
// 					{ amazonUserId: userId },
// 					{ accountUserId: userId }
// 				  ]
// 				},
// 				{
// 					status: {
// 						[Op.in]: ['completed', 'on-hold']
// 					  }
// 				}
// 			  ]
// 			}
// 		  });


// 		  const pendingOrder = await Orders.findAll({
// 			where: {
// 			  [Op.and]: [
// 				{
// 				  [Op.or]: [
// 					{ amazonUserId: userId },
// 					{ accountUserId: userId }
// 				  ]
// 				},
// 				{
// 				  status: "pending"
// 				}
// 			  ]
// 			},
// 			include: [
// 			  {
// 				model: Users, // replace with the actual model name
// 				as: 'amazonUser', // replace with the appropriate association alias
// 				attributes: ['name'] // replace 'name' with the actual attribute name
// 			  }
// 			]
// 		  });


// 		  //finding the completed and pending order in single query 
// 		  const pendingAndCompleted = await Orders.findAll({
// 			where: {
// 			  [Op.and]: [
// 				{
// 				  [Op.or]: [
// 					{ amazonUserId: userId },
// 					{ accountUserId: userId }
// 				  ]
// 				},
// 				{
// 				  status: {
// 					[Op.in]: ['completed', 'pending']
// 				  }
// 				}
// 			  ]
// 			},
// 			include: [
// 			  {
// 				model: Users,
// 				as: 'amazonUser',
// 				attributes: ['name']
// 			  },
// 			  {
// 				model: Users,
// 				as: 'accountUser', // Assuming you have an association named 'accountUser' in the Orders model
// 				attributes: ['name'] // Replace 'name' with the actual attribute name for the user's name
// 			  }
// 			],
// 			order: [['createdAt', 'DESC']]
// 		  });
		  
		
		  



// 		  let employeesData = await Users.findAll({
// 			where: {
// 				role: 'employee',
// 			},
// 			include: [
// 				{
// 					model: Powers,
// 				}
	
// 			]
// 		});

// 		let userid=req.session.user.id;
// 		let user=await Users.findByPk(userid,{
// 			include: [
// 				{
// 				  model: Powers,
// 				  through: UserPowers,
// 				  as: 'Powers', // Assuming your association is named "Powers"
// 				},
// 			  ],
// 		  });



// 		  const userPowers = user.Powers; // This will be an array of powers
// 		  console.log("-----------------",userPowers)
//   // You can further work with the userPowers array as needed
//   //console.log("vvv",userId);
		 
// 		const assignedCount = assigned.length;
// 		const completedOrderCount= completedOrders.length;
// 		//console.log(employeesData)
		
	
// 		res.render("amazon/dashboard", {pendingAndCompleted, pendingOrder, assignedCount,completedOrderCount, employeesData,userPowers,user });
// 	  } catch (error) {
// 		console.error("Error:", error);
// 		res.status(500).send("An error occurred");
// 	  }
// };






// //this routes is used to return the view to amazon user to add Order
// exports.ordersAdd= async(req,res)=>{
// 	let order
// 	let orderid
//    res.render("amazon/addOrder",{order,orderid});
// };




// exports.addOrderProcess= async(req,res)=>{

// 	try {
		
// 		const {
// 			orderId,
// 			comments,
// 			amazonAccount,
// 			orderDate,
// 			shipBy,
// 			deliverBy,
// 			purchaseDate,
// 			contactBuyer,
// 			customerType,
// 			distributor,
// 			mfrName,
// 			skus,
// 			quantity,
// 			price,
// 			tax,
// 			shippingFee,
// 			amazonFee,
// 			mft,
// 			yourEarnings,
// 			cost,
// 			freightCost,
// 			handlingFee,
// 			shippingAddress,
// 			addressType,
// 			phone,
// 			companyPhone,
// 			email,
// 			filename,
			
// 		  } = req.body;
// 		  //console.log("============",req.body.filename)
	  
// 		  // Create the order
// 		  const order = await Orders.create({
// 			orderId,
// 			amazonComments:comments,
// 			amazonAccount,
// 			orderDate,
// 			shipBy,
// 			deliverBy,
// 			purchaseDate,
// 			contactBuyer,
// 			customerType,
// 			distributor,
// 			mfrName:mfrName,
// 			sku:skus,
// 			quantity,
// 			price,
// 			tax,
// 			shippingFee,
// 			amazonFee,
// 			mft,
// 			yourEarning:yourEarnings,
// 			cost,
// 			freightCost,
// 			handlingFee,
// 			shippingAddress,
// 			addressType,
// 			phone,
// 			companyPhone,
// 			email,
// 			amazonUserId: req.session.user.id,
// 			filename,
			
// 		  });
	
// 		// Create an array to hold item objects
		
	
// 		// Bulk create the items
		
	
// 		return res.status(201).json({ message: "Order created successfully", 
//         orderId: order.orderId, // Send the orderId from the created order
//         amazonUserId: order.amazonUserId, });
// 	  } catch (error) {
// 		console.error(error);
// 		return res.status(500).json({ error: error.message });
// 	  }
	
//  };
 
//  exports.addAccountOrderProcess= async(req,res)=>{
// 	try {
// 		var userId = req.session.user.id;
		
		
// 		const completedOrders = await Orders.findAll({
// 			where: {
// 			  [Op.and]: [
// 				{
// 				  accountUserId: userId,
// 				  status: {
// 					[Op.or]: ["completed", "cancelled"]
// 				  }
// 				},
// 				{
// 				  status: {
// 					[Op.not]: "in-progress"
// 				  }
// 				}
// 			  ]
// 			},
// 			include: [
// 			  {
// 				model: Users,
// 				as: 'amazonUser',
// 				attributes: ['name']
// 			  }
// 			]
// 		  });
// 		  //console.log("_____",userId)
// 		  const pendingOrder = await Orders.findAll({
// 			where: {
// 				[Op.and]: [
// 				  {
// 					[Op.or]: [
					 
// 					  { accountUserId: userId }
// 					]
// 				  },
// 				  {[Op.or]: [
// 				  {
// 					status: "in-progress"
// 				  },
// 				  {
// 					status: "pending"
// 				  }
// 				]}
// 				]
// 			  },
// 			include: [
// 				{
// 				  model: Users, // replace with the actual model name
// 				  as: 'amazonUser', // replace with the appropriate association alias
// 				  attributes: ['name'] // replace 'name' with the actual attribute name
// 				}
// 			  ]
// 		  });
// 		  const pendingOrderCount= await Orders.findAll({
// 			where: {
				
// 					status: "pending"
				  
// 			  },
// 			  include: [
// 				{
// 				  model: Users, // replace with the actual model name
// 				  as: 'amazonUser', // replace with the appropriate association alias
// 				  attributes: ['name'] // replace 'name' with the actual attribute name
// 				}
// 			  ]
// 		  });


// 		  let employeesData = await Users.findAll({
// 			where: {
// 				role: 'employee',
// 			},
// 			include: [
// 				{
// 					model: Powers,
// 				}
	
// 			]
// 		});

// 		let userid=req.session.user.id;
// 		let user=await Users.findByPk(userid,{
// 			include: [
// 				{
// 				  model: Powers,
// 				  through: UserPowers,
// 				  as: 'Powers', // Assuming your association is named "Powers"
// 				},
// 			  ],
// 		  });



// 		  const userPowers = user.Powers; // This will be an array of powers

//   // You can further work with the userPowers array as needed
//   //console.log("vvv",userId);
		 
// 		const completedOrderCount= completedOrders.length;
// 		const pendingCount=pendingOrderCount.length;
// 		//console.log("count",pendingOrderCount.length)
// 	//console.log("Length iss",pendingOrder.length)
	

	
// 		res.render("employee/accountDashboard", { pendingOrder,completedOrderCount,completedOrders,pendingCount,employeesData,userPowers,user });
// 	  } catch (error) {
// 		console.error("Error:", error);
// 		res.status(500).send("An error occurred");
// 	  }
    
// };
// exports.detailsOrderAccount= async(req,res)=>{
// 	const orderId = req.params.orderId;
// 	const record = await Orders.findAll({
// 		where: {
// 		  [Op.and]: [
		
		
// 			{
// 			  id: orderId,
// 			},
// 			// {
// 			// 	accountUserId:req.session.user.id,
// 			// }
// 		  ]
// 		},
		
// 	  });
// 	  //console.log(record[0])
// 	  lastRecord = await Orders.findAll({
// 		where: {
// 		  id: {
// 			[Op.lt]: orderId, // Find records with id less than the current orderId
// 		  },
		 
// 		},
// 		order: [['id', 'DESC']], // Sort the results in descending order by id
// 		limit: 1, // Limit the result to 1 record (the most recent previous record)
// 	  });
		
// 	  console.log("++",record[0])
	
//     res.render("dashboard-one",{record:record.length ? record[0] : {},lastRecord:lastRecord.length ? lastRecord[0] : {}})
// };
// exports.amazonOrderDetail= async(req,res)=>{
// 	const orderId = req.params.orderid;
	
// 	const record = await Orders.findAll({
// 		where: {
// 			[Op.and]: [
// 			  {
// 				id: orderId,
// 			  },
// 			//   {
// 			// 	latestNo: {
// 			// 	  [Op.ne]: null,
// 			// 	},
// 			//   },
// 			  // You can include more conditions here if needed
// 			],
// 		  },
		
// 	  });
// 	  console.log(record[0])
	  
	
//     res.render("viewOrderAmazon",{record:record.length ? record[0] : {}})
// };

// exports.updateOrderAccount= async(req,res)=>{
// 	const { orderId, status, po, comments,payment,processedAccount,invoiceNo,billNo,latestNo,sixSeries} = req.body;
// //console.log(invoiceNo)

// try {
//     const record = await Orders.findOne({
//         where: {
//             id: orderId
//         }
//     });

//     if (record) {
//         // Update the record with the new data
//         record.status = status;
//         record.poNumber = po;
//         record.accountComments = comments;
//         record.paymentTerm = payment;
// 		record.processedAccount =(processedAccount == 'Other') ?"Other" : processedAccount;
// 		record.invoiceNo =invoiceNo;
// 		record.billNo =billNo;
// 		record.poSixSeries=(processedAccount == 'Other') ? sixSeries : '',
// 		record.latestNo=latestNo;
		
// 		record.completeOrCancelDate =new Date().toISOString();;

		

//         await record.save();
// 		//console.log("===",)
//         res.status(200).json({status:true, message: "Order updated successfully", orderId: record.orderId,           // Include the orderId in the response
// 		accountUserId: record.accountUserId, // Include the accountUserId in the response
// 		updatedStatus: status  });
//     } else {
//         res.status(404).json({ status:false,message: "Order not found" });
//     }
// } catch (error) {
//     console.error("Error updating order:", error);
//     res.status(500).json({ message: "An error occurred while updating the order" });
// }

// };
// exports.orderRefresh= async(req,res)=>{
// 	try {
//         await db.sequelize.transaction(async () => {
//             // Query to find a pending order
//             const record = await Orders.findOne({
//                 where: {
//                     status: "pending",
//                     // You can add more conditions here if needed
//                 }
//             });
// 			//console.log("dsadsasad",record)
//             if (record) {
//                 // Count user's assigned orders that are not completed or cancelled
//                 const userAssignedOrdersCount = await Orders.count({
//                     where: {
//                         [Op.and]: [
//                             {
//                                 status: {
//                                     [Op.not]: "completed",
//                                 },
//                             },
//                             {
//                                 status: {
//                                     [Op.not]: "cancelled",
//                                 },
//                             },
//                             {
//                                 status: {
//                                     [Op.not]: "on-hold",
//                                 },
//                             },
//                         ],
//                         accountUserId: req.session.user.id,
//                     },
//                 });

//                 //console.log("count is", userAssignedOrdersCount);

//                 if (!userAssignedOrdersCount) {
//                     // Update the order's status to "in-progress" and assign the user
//                     await Orders.update(
//                         {
//                             status: "in-progress",
//                             accountUserId: req.session.user.id,
//                             inProgressDate: new Date()
//                         },
//                         {
//                             where: { id: record.id }
//                         }
//                     );

//                     res.json({ status: true });
//                 } else {
//                     res.json({ status: false });
//                     //console.log("============");
//                 }
//             } else {
//                 res.json({ status: false });
//             }
//         });

//         // If the execution reaches this line, the transaction has been committed successfully
//         // `result` is whatever was returned from the transaction callback (the `user`, in this case)
//     } catch (error) {
// 		//console.log(error)
//         // If the execution reaches this line, an error occurred.
//         // The transaction has already been rolled back automatically by Sequelize!
// 		res.json({ status: false });
//     }
// };

// // exports.sendMailAmazon= async(req,res)=>{
// //     const { orderId, amazonUserId } = req.body;

// // 	const amazonUserIdToLookup = amazonUserId; // Replace with the actual amazonUserId you have
// // let  USER= await Users.findOne({
// //   where: {
// //     id: amazonUserIdToLookup,
// //   },
// // })
  
// // let userName = ""; // Initialize userName

// // if (USER) {
// //   userName = USER.name; // Assign the user's name if found
// // } else {
// //   userName = amazonUserId; // Use amazonUserId as the name if user not found
// // }

// //     try {
// //         // Create the transporter
// //         const transporter = nodemailer.createTransport({
// //             host: 'in-v3.mailjet.com',
// //             port: 587,
// //             auth: {
// //                 user: '8ae0660a50d9e557cceeb6c5fd2a9ff9',
// //                 pass: '1379ad630084466ed118f6ea6f983366'
// //             }
// //         });

// //         // Construct the email content
// //         const emailContent = `New order created\nOrder ID: ${orderId}\n By Amazon User : ${userName}\n\n\nThis project is not maintained anymore due to lack of budget.For any inconvenience Please Visit HR. `;

// //         // Send the email
// // 		const emailResponse =  await transporter.sendMail({
// //             from: 'noreply@vcloudtech.info',
// //             to: 'hamzawaleed511@gmail.com',
// //             subject: 'New Order Created',
// //             text:  emailContent
// //         });
// // 		//console.log('Email Response:', emailResponse);
// //         return res.status(200).json({ message: 'Email sent successfully' });
// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).json({ error: error.message });
// //     }
// // }
// // exports.sendEmailAccount= async(req,res)=>{
// //     const { orderid, userid,status } = req.body;

// //     try {
// //         // Create the transporter
// //         const transporter = nodemailer.createTransport({
// //             host: 'in-v3.mailjet.com',
// //             port: 587,
// //             auth: {
// //                 user: '8ae0660a50d9e557cceeb6c5fd2a9ff9',
// //                 pass: '1379ad630084466ed118f6ea6f983366'
// //             }
// //         });

// //         // Construct the email content
// //         const emailContent = `A Task Has Been ${status} \n By Account User ID: ${userid}\nOrder ID: ${orderid}\n\n\nThis project is not being maintained anymore due to lack of budget.For any inconvenience Please Visit HR. `;

// //         // Send the email
// // 		const emailResponse =  await transporter.sendMail({
// //             from: 'noreply@vcloudtech.info',
// //             to: 'muhammadmuhib60@gmail.com',
// //             subject: 'Status Updated',
// //             text:  emailContent
// //         });
// // 		//console.log('Email Response:', emailResponse);
// //         return res.status(200).json({ message: 'Email sent successfully' });
// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).json({ error: 'Error sending email' });
// //     }
// // };

// exports.addFile = async (req, res) => {
// 	try {
// 		const files = req.files; // 'files' should be the property name corresponding to the input field name
	
// 		const uploadedFiles = [];
	
// 		for (const key of Object.keys(files)) {
// 		  const file = files[key];
		  
// 		  if (file.mimetype !== "application/pdf") {
// 			return res.status(400).json({ error: "Only PDF files are allowed." });
// 		  }
	
// 		  const pathToFile =
// 			path.join(__dirname, "../public/files", `${Date.now()}_${file.name}`);
// 			console.log(pathToFile,'ppppppppppppppppppppppppppppppppppp')
			
// 		  await file.mv(pathToFile);
	
// 		  const prefixToRemove = '/root/OrderAutomation/public/files/';
  
//   const trimmedFilePath = pathToFile.replace(new RegExp(`^${prefixToRemove}`), '');
// 		  uploadedFiles.push(trimmedFilePath);
// 		}
	
// 		const fileNamesString = uploadedFiles.join(", ");
// 		//console.log(fileNamesString)
// 		res.json({ fileNamesString });
// 	  } catch (error) {
// 		//console.log("Error:", error.message);
// 		res.status(500).json({ error: "An error occurred." });
// 	  }
//   };
	



//   //export records starts here 
  
//   exports.exportOrders = async (req, res) => {
// 	//console.log('export data',req.body);
// 	let { fromDate, toDate, employees, status } = req.body;
//     fromDate=new Date(fromDate)
// 	toDate = new Date(new Date(toDate).setHours(23, 59, 59))
// 	try {
// 		const exportOrders = await Orders.findAll({
// 			attributes: [
// 				"id", // Include any other attributes you need in this array
// 				"poDate",
// 				"deliverBy",
// 				"deliveredDate",
// 				"trackingNo",
// 				"accountComments",
// 				"verificationStatus",
// 				"processedAccount",
// 				"poSixSeries",
// 				"poNumber",
// 				"status",
// 				"orderId",
// 				"sku",
// 				"invoiceNo",
// 				"billNo",
// 				"shippingAddress",
// 				"mfrName",
// 				"distributor",
// 				"paymentTerm",
// 				"cost",
// 				"shippingDiscount",
// 				"handlingFee",
// 				"saleTax",
// 				"insurance",
// 				"creditMemo",
// 				"miscFee",
// 				"resoldRevenue",
// 			  ],
// 			where: {
// 				createdAt: {
// 					[Op.between]: [fromDate, toDate], // Use the between operator
// 				},
// 				[Op.or]: [
// 					{
// 						amazonUserId: { [Op.in]: employees }
// 					},
// 					{
// 						accountUserId: { [Op.in]: employees }
// 					}
// 				],
// 				status: { [Op.in]: status }
// 			},
// 			include: [
// 				{
// 					model: Users,
// 					as: 'accountUser',
// 				},
// 				{
// 					model: Users,
// 					as: 'amazonUser',
// 				},
// 			],


// 			// ... include options
// 		});

// //console.log("exportorders ++",exportOrders)

// 		const generateRowsForOneOrder = (order) => {
		
// 			//console.log("++++",order)
// 			const rows = [];
// 			const skus = order.sku.split('|');
// 			//console.log("===========================",skus)
		  
// 			for (let index = 0; index < skus.length; index++) {
// 			  let row = '';
// 			  for (const key in order) {
// 				if (order.hasOwnProperty(key) && key !== 'id') {
// 					if (key === "sku") {
// 						row += skus[index] + "#&a";
// 					  } else if (key === "amazonUser") {
// 						row += order.amazonUser.dataValues.name;
// 					  } else if (key === "accountUser") {
// 						row += order?.accountUser ? order?.accountUser?.dataValues?.name + "#&a" : "#&a";
// 					  }
// 				  else if (key === "quantity") {
// 					row += order.quantity.split('|')[index] + "#&a";
// 				  }
// 				  else if (key === "price") {
// 					row += order.price.split('|')[index] + "#&a";
// 				  }
// 				  else if (key === "cost") {
// 					row += order.cost.split('|')[index] + "#&a";
// 				  }
// 				  else if (key === "tax") {
// 					row += order.tax.split('|')[index] + "#&a";
// 				  }
// 				  else if (key === "shippingFee") {
// 					row += order.shippingFee.split('|')[index] + "#&a";
// 				  }
// 				  else if (key === "handlingFee") {
// 					row += order.handlingFee.split('|')[index] + "#&a";
// 				  }
// 				  else if (key === "mft") {
// 					row += order.mft.split('|')[index] + "#&a";
// 				  } else if (key === "freightCost") {
// 					row += order.freightCost.split('|')[index] + "#&a";
// 				  }
// 				  else if (key === "amazonFee") {
// 					row += order.amazonFee.split('|')[index] + "#&a";
// 				  }
// 				  else if (key === "yourEarning") {
// 					row += order.yourEarning.split('|')[index] + "#&a";
// 				  }
		  
// 				  else {
		  
// 					row += order[key] + "#&a";
// 				  }
// 				}
// 			  }
			 
// 			  rows.push(row);
// 			}
		  
// 			return rows;
// 		  };
		  
		 
// 		  function generateHeadersForExportFile(order) {
// 			let headers = [];
// 			for (const key in order) {
// 			  if (order.hasOwnProperty(key) && key !== 'id') {
// 				headers.push({ header: key, key: key });
// 			  }
// 			}
// 		//   //console.log(headers)
// 		headers=  [
// 			{ header: 'po Date', key: 'poDate' },
// 			{ header: 'deliverBy', key: 'deliverBy' },
// 			{ header: 'deliveredDate', key: 'deliveredDate' },
// 			{ header: 'trackingNo', key: 'trackingNo' },
// 			{ header: 'accountComments', key: 'accountComments' },
// 			{ header: 'verificationStatus', key: 'verificationStatus' },
			
// 			{ header: 'processedAccount', key: 'processedAccount' },
// 			{ header: 'poSixSeries', key: 'poSixSeries' },
// 			{ header: 'poNumber', key: 'poNumber' },
// 			{ header: 'status', key: 'status' },
// 			{ header: 'orderId', key: 'orderId' },
// 			{ header: 'sku', key: 'sku' },
// 			{ header: 'invoiceNo', key: 'invoiceNo' },
// 			{ header: 'billNo', key: 'billNo' },
// 			{ header: 'shippingAddress', key: 'shippingAddress' },
// 			{ header: 'mfrName', key: 'mfrName' },
// 			{ header: 'distributor', key: 'distributor' },
// 			{ header: 'paymentTerm', key: 'paymentTerm' },
// 			{ header: 'cost', key: 'cost' },
// 			{ header: 'shippingDiscount', key: 'shippingDiscount' },
// 			{ header: 'handlingFee', key: 'handlingFee' },
// 			{ header: 'saleTax', key: 'saleTax' },
// 			{ header: 'insurance', key: 'insurance' },
// 			{ header: 'creditMemo', key: 'creditMemo' },
// 			{ header: 'miscFee', key: 'miscFee' },
// 			{ header: 'Signature Fee', key: 'resoldRevenue' },
// 			{ header: 'Purchasing Rep', key: 'accountUser' },
// 			{ header: 'Amazon Rep', key: 'amazonUser' },
		
// 			{ header: 'Outbound Shipping', key: 'Outbound Shipping' },
// 			{ header: 'Net Outbound Shipping (for QB)', key: 'Net Outbound Shipping (for QB)' }
// 		  ]
// 			return headers;
// 		  }





// 		const workbook = new excel.Workbook();
// 		workbook.creator = 'Your Name';
// 		workbook.lastModifiedBy = 'Your Name';
// 		workbook.created = new Date();
// 		workbook.modified = new Date();

// 		const worksheet = workbook.addWorksheet('Sheet 1');

// 		const headers = generateHeadersForExportFile(exportOrders[0]?.dataValues)
// 		// const headers = [
// 		// 	"PO Date",
// 		// 	"Deliver BY",
// 		// 	"Delivered Date",
// 		// 	"Tracking#",
// 		// 	"Comments/Order#",
// 		// 	"Verification Status",
// 		// 	"Purchasing Rep",
// 		// 	"PO Processed Account",
// 		// 	"Tech PO",
// 		// 	"Choice PO",
// 		// 	"Order Status (Valid/Cancelled)",
// 		// 	"Customer PO # (Amazon Order ID)",
// 		// 	"SKU #",
// 		// 	"QB Invoice #",
// 		// 	"QB Bill #",
// 		// 	"City",
// 		// 	"State",
// 		// 	"Zip Code",
// 		// 	"Manufacturer",
// 		// 	"Distributor",
// 		// 	"Payment Terms",
// 		// 	"Items Cost (COGS)",
// 		// 	"Shipping Discount",			
// 		// 	"Handling Fee",
// 		// 	"Sales Tax (Vendor)",
// 		// 	"Insurance Fee",
// 		// 	"Credit Memo",
// 		// 	"Misc. Fee",
// 		// 	"Signature Fee",
// 		// 	"Total COGS",
// 		// 	"GP",
// 		// 	"Outbound Shipping",
// 		// 	"Net Outbound Shipping (for QB)"
// 		//   ];

// 		worksheet.columns = headers;
// 		const filePath = path.join(__dirname, '../export/account', 'file.xlsx');
// 		//fs.writeFileSync(filePath,'')
// 		for (let index = 0; index < exportOrders.length; index++){
// 			const order = exportOrders[index];
// 			const dataValues = order.dataValues;
		
// 			let concatenatedString = '';
// 			let rows
		
			
// 				rows=await generateRowsForOneOrder(dataValues);
				
// 		for (let index = 0; index < rows.length; index++) {
			
			
			
	
// 			const splitArray = rows[index].split('#&a');
// 			// splitArray.shift();
		
// 			worksheet.addRow(splitArray);
// 		}
			
// 		}
		
		
// 		workbook.xlsx.writeFile(filePath)
// 			.then(() => {
// 				//console.log('Excel file created successfully.');
// 			})
// 			.catch((error) => {
// 				console.error('Error creating Excel file:', error);
// 			});



// 		}


// 		// Calculate process time for each order and modify the exportOrders
// 		// 	  const modifiedOrders = exportOrders.map(order => {
// 		// 		const modifiedOrder = { ...order.dataValues };

// 		// 		if (modifiedOrder.accountUser) {
// 		// 		  modifiedOrder.accountUser = modifiedOrder.accountUser.dataValues.name;
// 		// 		}

// 		// 		if (modifiedOrder.amazonUser) { 
// 		// 		  modifiedOrder.amazonUser = modifiedOrder.amazonUser.dataValues.name;
// 		// 		}

// 		// 		if (modifiedOrder.inProgressDate && modifiedOrder.completeOrCancelDate) {
// 		// 		  const processTime = modifiedOrder.completeOrCancelDate - modifiedOrder.inProgressDate;
// 		// 		  modifiedOrder.processTimeInMinutes = processTime / (1000 * 60); // Calculate process time in minutes
// 		// 		}

// 		// 		return modifiedOrder;
// 		// 	  });

// 		// 	  // Define the export directory
// 		// 	  const exportDir = path.join(__dirname, '..', 'export');
// 		// 	  if (!fs.existsSync(exportDir)) {
// 		// 		fs.mkdirSync(exportDir);
// 		// 	  }

// 		// 	  // Define the CSV file path
// 		// 	  const csvFilePath = path.join(exportDir, `orders_${Date.now()}.csv`);

// 		// 	  // Extract column names from the modifiedOrders object and remove empty keys
// 		// 	  const columnNames = Object.keys(modifiedOrders[0]).filter(key => key);
// 		//   //console.log(columnNames);
// 		// 	  // Define the CSV writer with the extracted column names as header
// 		// 	  const csvWriter = await createObjectCsvWriter({
// 		// 		path: csvFilePath,
// 		// 		header: [
// 		// 		  ...columnNames.filter(key => key !== 'amazonUserId' && key !== 'accountUserId'),
// 		// 		  { id: 'processTimeInMinutes', title: 'Process Time (minutes)' }, // Add process time header
// 		// 		],
// 		// 	  });

// 		// 	  // Write the header row to the CSV file
// 		// 	  await csvWriter.writeRecords([{}]);

// 		// 	  // Write the modified orders with the process times to the CSV file
// 		// 	  await csvWriter.writeRecords(modifiedOrders);

// 		// 	  // Set headers for the download response
// 		// 	  res.setHeader('Content-Disposition', `attachment; filename=${path.basename(csvFilePath)}`);
// 		// 	  res.setHeader('Content-Type', 'text/csv');

// 		// 	  // Stream the file to the response
// 		// 	  const fileStream = fs.createReadStream(csvFilePath);
// 		// 	  fileStream.pipe(res);

// 		// 	  // After sending the response, delete the CSV file
// 		// 	  fileStream.on('end', () => {
// 		// 		fs.unlink(csvFilePath, err => {
// 		// 		  if (err) {
// 		// 			console.error('Error deleting CSV file:', err);
// 		// 		  }
// 		// 		});
// 		// 	  });
	
// 	catch (error) {
// 		console.error('Error exporting orders:', error);
// 		res.status(500).send('An error occurred while exporting orders.');
// 	}
// };



// // downloading the csv after creating the csv 
// //on the same ajax call which is exporting the record  on client side  another function runs

// exports.downloadCsv = (req, res) => {
// 	const filePath = path.join(__dirname, '../export/account', 'file.xlsx'); // Assuming file.csv is in the root directory
// 	//console.log('Downloading the File');
// 	res.download(filePath, 'file.xlsx', (err) => {
// 		if (err) {
// 			res.status(500).send('Error downloading the file.');
// 		}
// 	});
// };

















// exports.orderPaginate = async (req, res) => {
// 	const { iDisplayLength, sEcho, sSearch, iDisplayStart } = JSON.parse(
// 		JSON.stringify(req.body)
// 	);console.log(" ssersch ");
// 	var pageNo = parseInt(sEcho);
// 	var size = parseInt(iDisplayLength);
// 	var query = {};
// 	if (pageNo < 0 || pageNo === 0) {
// 		response = {
// 			error: true,
// 			message: "invalid page number, should start with 1",
// 		};
// 		return res.json(response);
// 	}
// 	query.offset = parseInt(iDisplayStart);
// 	query.limit = size;
// 	console.log("ssersch",);
// 	if (sSearch) {
// 		console.log("ssersch",);
// 		Orders.findAll({
// 			where: {
// 				[Op.or]: [
// 					{ orderId: { [Op.substring]: sSearch } },
// 					{ poNumber: { [Op.substring]: sSearch } },
// 					{ email: { [Op.substring]: sSearch } },
// 					{ createdAt: { [Op.substring]: sSearch } },
// 					{ status: { [Op.substring]: sSearch } },
// 				],
				
// 			},
// 			include : [
// 				{
// 					model: Users,
// 					as: 'amazonUser', // Replace with the appropriate association alias
// 					attributes: ['name']
// 				},{
// 					model: Users,
// 					as: 'accountUser', // Replace with the appropriate association alias
// 					attributes: ['name']
// 				}
// 			],
// 			order: [['createdAt', 'DESC']],
// 			offset: parseInt(iDisplayStart) < 1 ? 0 : parseInt(iDisplayStart),
// 			limit: parseInt(iDisplayLength),
// 		})
// 			.then(async (data) => {
// 				let skodaJsonDataArr = new Array();
// 				for (let i = 0; i < data.length; i++) {

// 					let dataObj = new Object();
// 					if (data[i].orderId != undefined) {
// 						dataObj.orderId = data[i].orderId;
// 					} else {
// 						dataObj.orderId = "";
// 					}
// 					if (data[i].poNumber != undefined) {
// 						dataObj.poNumber = data[i].poNumber;
// 					} else {
// 						dataObj.poNumber = "";
// 					}

// 					dataObj.email = data[i].email ? data[i].email : ""

// 					dataObj.status = data[i].status ? data[i].status : ""

// 					dataObj.createdAt = data[i].createdAt ? data[i].createdAt : ""

					
// 					// dataObj.edit = `<a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a>`
					
// 					// dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a> `
// 					dataObj.details = `<a class="btn btn-primary" href="/employee/detailsOrderAccount/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a> `
					
					
// 					dataObj.amazonUserName = data[i]?.amazonUser?.name || "";
// 					dataObj.accountUserName = data[i]?.accountUser?.name || "";
	
// 					dataObj.createdBy = dataObj.amazonUserName ? dataObj.amazonUserName : "";
// 					dataObj.processedBy = dataObj.accountUserName ? dataObj.accountUserName : "";

// 					skodaJsonDataArr.push(dataObj);
// 				}
// 				response = skodaJsonDataArr;
// 				Orders.count({
// 					where: {
// 						[Op.or]: [
// 							{ orderId: { [Op.substring]: sSearch } },
// 							{ poNumber: { [Op.substring]: sSearch } },
// 							{ email: { [Op.substring]: sSearch } },
// 							{ createdAt: { [Op.substring]: sSearch } },
// 							{ status: { [Op.substring]: sSearch } },
// 						],
// 					},
// 				})
// 					.then((count) => {
// 						res.send({
// 							draw: sEcho,
// 							recordsTotal: count,
// 							recordsFiltered: count,
// 							data: response,
// 						});
// 					})
// 					.catch((err) => {
// 						if (err) console.log(err);
// 					});
// 			})
// 			.catch((e) => {
// 				console.log(sSearch);
// 				response = {
// 					error: true,
// 					e,
// 					message: "Error fetching data",

// 				};

// 				Orders.count()
// 					.then((count) => {
// 						res.send({
// 							draw: sEcho,
// 							recordsTotal: count,
// 							recordsFiltered: count,
// 							data: response,
// 						});
// 					})
// 					.catch((err) => {
// 						if (err) console.log(err);
// 					});
// 			});
// 	} else {
// 		//console.log("!!!ssersch");
// 		user=req.session.user.id
// 		Orders.findAll({...query,
// 			where: {
// 				status: {
// 					[Op.in]: ['completed', 'on-hold','cancelled'],
// 				  },
// 				accountUserId: user
// 			},
// 			include: [
// 				{
// 					model: Users,
// 					as: 'amazonUser', // Replace with the appropriate association alias
// 					attributes: ['name']
// 				},
// 			],
// 			order: [['createdAt', 'DESC']],
// 			})
// 		.then(async (data) => {
// 			let skodaJsonDataArr = new Array();
// 			for (let i = 0; i < data.length; i++) {

// 				let dataObj = new Object();
// 				if (data[i].orderId != undefined) {
// 					dataObj.orderId = data[i].orderId;
// 				} else {
// 					dataObj.orderId = "";
// 				}
// 				if (data[i].poNumber != undefined) {
// 					dataObj.poNumber = data[i].poNumber;
// 				} else {
// 					dataObj.poNumber = "";
// 				}
				
// 				dataObj.amazonUserName = data[i]?.amazonUser?.name || "";
// 				dataObj.accountUserName = data[i]?.accountUser?.name || "";

// 				dataObj.email = data[i].email ? data[i].email : ""

// 				dataObj.status = data[i].status ? data[i].status : ""

// 				dataObj.createdAt = data[i].createdAt ? data[i].createdAt : ""

			
// 				dataObj.details = `<a class="btn btn-primary" href="/employee/detailsOrderAccount/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a> `
				
// 				dataObj.createdBy = dataObj.amazonUserName ? dataObj.amazonUserName : "";
			
		

// 				skodaJsonDataArr.push(dataObj);
// 			}
// 			response = skodaJsonDataArr;
// 			Orders.count({})
// 				.then((count) => {
// 					res.send({
// 						draw: sEcho,
// 						recordsTotal: count,
// 						recordsFiltered: count,
// 						data: response,
// 					});
// 				})
// 				.catch((err) => {
// 					if (err) console.log(err);
// 				});
// 		})
// 		.catch((e) => {
// 			//console.log(e);
// 			response = {
// 				error: true,
// 				e,
// 				message: "Error fetching data",
// 			};
			
			
// 				Orders.count()
// 					.then((count) => {
// 						res.send({
// 							draw: sEcho,
// 							recordsTotal: count,
// 							recordsFiltered: count,
// 							data: response,
// 						});
// 					})
// 					.catch((err) => {
// 						if (err) console.log(err);
// 						else {
// 						}
// 					});
// 			});
// 	}
// };



















// exports.orderPaginateAmazon = async (req, res) => {
// 	const { iDisplayLength, sEcho, sSearch, iDisplayStart } = JSON.parse(
// 		JSON.stringify(req.body)
// 	);
// 	var pageNo = parseInt(sEcho);
// 	var size = parseInt(iDisplayLength);
// 	var query = {};
// 	if (pageNo < 0 || pageNo === 0) {
// 		response = {
// 			error: true,
// 			message: "invalid page number, should start with 1",
// 		};
// 		return res.json(response);
// 	}
// 	query.offset = parseInt(iDisplayStart);
// 	query.limit = size;
	
// 	if (sSearch) {
// 		//console.log("ssersch");
// 		Orders.findAll({
// 			where: {
// 				[Op.or]: [
// 					{ orderId: { [Op.substring]: sSearch } },
// 					{ poNumber: { [Op.substring]: sSearch } },
// 					{ email: { [Op.substring]: sSearch } },
// 					{ createdAt: { [Op.substring]: sSearch } },
// 					{ status: { [Op.substring]: sSearch } },
// 				],
// 			},
// 			include : [
// 				{
// 					model: Users,
// 					as: 'amazonUser', // Replace with the appropriate association alias
// 					attributes: ['name']
// 				},{
// 					model: Users,
// 					as: 'accountUser', // Replace with the appropriate association alias
// 					attributes: ['name']
// 				}
// 			],
// 			order: [['createdAt', 'DESC']],
// 			offset: parseInt(iDisplayStart) < 1 ? 0 : parseInt(iDisplayStart),
// 			limit: parseInt(iDisplayLength),
// 		})
// 			.then(async (data) => {
// 				let skodaJsonDataArr = new Array();
// 				for (let i = 0; i < data.length; i++) {

// 					let dataObj = new Object();
// 					if (data[i].orderId != undefined) {
// 						dataObj.orderId = data[i].orderId;
// 					} else {
// 						dataObj.orderId = "";
// 					}
// 					if (data[i].poNumber != undefined) {
// 						dataObj.poNumber = data[i].poNumber;
// 					} else {
// 						dataObj.poNumber = "";
// 					}

// 					dataObj.email = data[i].email ? data[i].email : ""

// 					dataObj.status = data[i].status ? data[i].status : ""

// 					dataObj.createdAt = data[i].createdAt ? data[i].createdAt : ""
// 					dataObj.rating = data[i].rating ? data[i].rating : ""

					
// 					if(data[i].status== "completed"){dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/duplicateOrder/${data[i].id}">Duplicate</a>`}else{
// 					dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a> <a class="btn btn-primary" href="/employee/duplicateOrder/${data[i].id}">Duplicate</a>`
// 				}
					
// 				dataObj.amazonUserName = data[i]?.amazonUser?.name || "";
// 				dataObj.accountUserName = data[i]?.accountUser?.name || "";

// 				dataObj.createdBy = dataObj.amazonUserName ? dataObj.amazonUserName : "";
// 				dataObj.processedBy = dataObj.accountUserName ? dataObj.accountUserName : "";
			

// 					skodaJsonDataArr.push(dataObj);
// 				}
// 				response = skodaJsonDataArr;
// 				Orders.count({
// 					where: {
// 						[Op.or]: [
// 							{ orderId: { [Op.substring]: sSearch } },
// 							{ poNumber: { [Op.substring]: sSearch } },
// 							{ email: { [Op.substring]: sSearch } },
// 							{ createdAt: { [Op.substring]: sSearch } },
// 							{ status: { [Op.substring]: sSearch } },
// 						],
// 					},
// 				})
// 					.then((count) => {
// 						res.send({
// 							draw: sEcho,
// 							recordsTotal: count,
// 							recordsFiltered: count,
// 							data: response,
// 						});
// 					})
// 					.catch((err) => {
// 						if (err) console.log(err);
// 					});
// 			})
// 			.catch((e) => {
// 				console.log(e);
// 				response = {
// 					error: true,
// 					e,
// 					message: "Error fetching data",
// 				};

// 				Orders.count()
// 					.then((count) => {
// 						res.send({
// 							draw: sEcho,
// 							recordsTotal: count,
// 							recordsFiltered: count,
// 							data: response,
// 						});
// 					})
// 					.catch((err) => {
// 						if (err) console.log(err);
// 					});
// 			});
// 	} else {
// 		//console.log("!!!ssersch");
// 		const userId = req.session.user.id;
// 		Orders.findAll({...query,
// 			include: [
// 				{
// 					model: Users,
// 					as: 'amazonUser', // Replace with the appropriate association alias
// 					attributes: ['name']
// 				},{
// 					model: Users,
// 					as: 'accountUser', // Replace with the appropriate association alias
// 					attributes: ['name']
// 				}
				
// 			], 
// 			order: [['createdAt', 'DESC']],
// 			// where: {
// 			// 	accountUserId: userId
// 			//   }
// 			})
// 		.then(async (data) => {
// 			let skodaJsonDataArr = new Array();
// 			for (let i = 0; i < data.length; i++) {

// 				let dataObj = new Object();
// 				if (data[i].orderId != undefined) {
// 					dataObj.orderId = data[i].orderId;
// 				} else {
// 					dataObj.orderId = "";
// 				}
// 				if (data[i].poNumber != undefined) {
// 					dataObj.poNumber = data[i].poNumber;
// 				} else {
// 					dataObj.poNumber = "";
// 				}
				
// 				dataObj.amazonUserName = data[i]?.amazonUser?.name || "";
// 				dataObj.accountUserName = data[i]?.accountUser?.name || "";


// 				dataObj.email = data[i].email ? data[i].email : ""

// 				dataObj.status = data[i].status ? data[i].status : ""

// 				dataObj.createdAt = data[i].createdAt ? data[i].createdAt : ""

// 				dataObj.rating = data[i].rating ? `<div class='ratingDiv' data-score='${data[i].rating}' data-orderid='${data[i].id}'></div>` : `<div class='ratingDiv' data-score='0' data-orderid='${data[i].id}'></div>`

			
// 					if(data[i].status== "completed"){dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/duplicateOrder/${data[i].id}">Duplicate</a>`}else{
// 					dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a><a class="btn btn-primary" href="/employee/duplicateOrder/${data[i].id}">Duplicate</a> `
// 				}
				
// 				dataObj.createdBy = dataObj.amazonUserName ? dataObj.amazonUserName : "";
// 				dataObj.processedBy = dataObj.accountUserName ? dataObj.accountUserName : "";
			
		

// 				skodaJsonDataArr.push(dataObj);
// 			}
// 			response = skodaJsonDataArr;
// 			Orders.count({})
// 				.then((count) => {
// 					res.send({
// 						draw: sEcho,
// 						recordsTotal: count,
// 						recordsFiltered: count,
// 						data: response,
// 					});
// 				})
// 				.catch((err) => {
// 					if (err) console.log(err);
// 				});
// 		})
// 		.catch((e) => {
// 			//console.log(e);
// 			response = {
// 				error: true,
// 				e,
// 				message: "Error fetching data",
// 			};
			
			
// 				Orders.count()
// 					.then((count) => {
// 						res.send({
// 							draw: sEcho,
// 							recordsTotal: count,
// 							recordsFiltered: count,
// 							data: response,
// 						});
// 					})
// 					.catch((err) => {
// 						if (err) console.log(err);
// 						else {
// 						}
// 					});
// 			});
// 	}
// };





















// exports.updateStatus= async(req,res)=>{
// 	const value =req.body.value;
// 	if (value == "completed") {
// 		const id = req.body.id;
// 		const completeValue = req.body.value;
// 		try {
// 			const record = await Orders.findOne({
// 				where: {
// 					id: id
// 				}
// 			});
		
// 			if (record) {
// 				// Update the record with the new data
// 				record.status = completeValue;
// 				// record.cfc = commentcancellation;
// 				// record.rfc = rfc;
// 				// record.CancelDate = new Date();
// 				// record.productChargesAudit = fee;
// 				// record.amazonFeeAudit = amazonfee;
// 				// record.shippingAudit = shippingcharge;
// 				// record.cancellationType= canceltype;
// 				// record.refundAudit= refundamount;
// 				// record.extrafeeAudit= extrafee;
	
		
// 				await record.save();
		
// 				res.status(200).json({
// 					status: true,
// 					message: "Updated successfully",
// 					orderId: id, // Include the orderId in the response
// 					alertMessage: "Order status has been updated."
// 				});
// 			} else {
// 				res.status(404).json({
// 					status: false,
// 					message: "Order not found"
// 				});
// 			}
// 		} catch (error) {
// 			console.error("Error updating order:", error);
// 			res.status(500).json({
// 				message: "An error occurred while updating the order"
// 			});
// 		}
	


// 	}else{
// 		const cancelValue = req.body.value;
// 		const id = req.body.id;
// 		// const canceltype = req.body.canceltype;
// 		const rfc = req.body.rfc;
// 		const commentcancellation = req.body.commentcancellation;
// 		// const fee = req.body.fee;
// 		// const refundamount = req.body.refundamount;
// 		// const shippingcharge = req.body.shippingcharge;
// 		// const amazonfee = req.body.amazonfee;
// 		// const extrafee = req.body.extrafee;
		
		
// 		try {
// 			const record = await Orders.findOne({
// 				where: {
// 					id: id
// 				}
// 			});
		
// 			if (record) {
// 				// Update the record with the new data
// 				record.status = cancelValue;
// 				record.cfc = commentcancellation;
// 				record.rfc = rfc;
// 				// record.CancelDate = new Date();
// 				// record.productChargesAudit = fee;
// 				// record.amazonFeeAudit = amazonfee;
// 				// record.shippingAudit = shippingcharge;
// 				// record.cancellationType= canceltype;
// 				// record.refundAudit= refundamount;
// 				// record.extrafeeAudit= extrafee;
	
		
// 				await record.save();
		
// 				res.status(200).json({
// 					status: true,
// 					message: "Updated successfully",
// 					orderId: id, // Include the orderId in the response
// 					alertMessage: "Order status has been updated."
// 				});
// 			} else {
// 				res.status(404).json({
// 					status: false,
// 					message: "Order not found"
// 				});
// 			}
// 		} catch (error) {
// 			console.error("Error updating order:", error);
// 			res.status(500).json({
// 				message: "An error occurred while updating the order"
// 			});
// 		}
// 	}
//     // const cancelValue = req.body.value;
//     // const id = req.body.id;
//     // // const canceltype = req.body.canceltype;
//     // const rfc = req.body.rfc;
//     // const commentcancellation = req.body.commentcancellation;
//     // // const fee = req.body.fee;
//     // // const refundamount = req.body.refundamount;
//     // // const shippingcharge = req.body.shippingcharge;
//     // // const amazonfee = req.body.amazonfee;
//     // // const extrafee = req.body.extrafee;
    
	
// 	// try {
// 	// 	const record = await Orders.findOne({
// 	// 		where: {
// 	// 			id: id
// 	// 		}
// 	// 	});
	
// 	// 	if (record) {
// 	// 		// Update the record with the new data
// 	// 		record.status = cancelValue;
// 	// 		record.cfc = commentcancellation;
// 	// 		record.rfc = rfc;
// 	// 		// record.CancelDate = new Date();
// 	// 		// record.productChargesAudit = fee;
// 	// 		// record.amazonFeeAudit = amazonfee;
// 	// 		// record.shippingAudit = shippingcharge;
// 	// 		// record.cancellationType= canceltype;
// 	// 		// record.refundAudit= refundamount;
// 	// 		// record.extrafeeAudit= extrafee;

	
// 	// 		await record.save();
	
// 	// 		res.status(200).json({
// 	// 			status: true,
// 	// 			message: "Updated successfully",
// 	// 			orderId: id, // Include the orderId in the response
// 	// 			alertMessage: "Order status has been updated."
// 	// 		});
// 	// 	} else {
// 	// 		res.status(404).json({
// 	// 			status: false,
// 	// 			message: "Order not found"
// 	// 		});
// 	// 	}
// 	// } catch (error) {
// 	// 	console.error("Error updating order:", error);
// 	// 	res.status(500).json({
// 	// 		message: "An error occurred while updating the order"
// 	// 	});
// 	// }


// };
// exports.refurb= async(req,res)=>{
   
//     const id = req.body.id;
//     const canceltype = req.body.canceltype;
   
//     const fee = req.body.fee;
//     const refundamount = req.body.refundamount;
//     const shippingcharge = req.body.shippingcharge;
//     const amazonfee = req.body.amazonfee;
//     const extrafee = req.body.extrafee;
//     //console.log("+++++++++++++++",req.body)
	
// 	try {
// 		const record = await Orders.findOne({
// 			where: {
// 				id: id
// 			}
// 		});
	
// 		if (record) {
// 			// Update the record with the new data
		
			
// 			record.productChargesAudit = fee;
// 			record.amazonFeeAudit = amazonfee;
// 			record.shippingAudit = shippingcharge;
// 			record.cancellationType= canceltype;
// 			record.refundAudit= refundamount;
// 			record.extrafeeAudit= extrafee;

	
// 			await record.save();
	
// 			res.status(200).json({
// 				status: true,
// 				message: "Updated successfully",
// 				orderId: id, // Include the orderId in the response
// 				alertMessage: "Order status has been updated."
// 			});
// 		} else {
// 			res.status(404).json({
// 				status: false,
// 				message: "Order not found"
// 			});
// 		}
// 	} catch (error) {
// 		console.error("Error updating order:", error);
// 		res.status(500).json({
// 			message: "An error occurred while updating the order"
// 		});
// 	}


// };
// exports.editRecord= async(req,res)=>{
//    const id= req.params.id
//    const record = await Orders.findAll({
// 	where: {
// 	  [Op.and]: [
// 		{
// 		  id
// 		},
// 		// {
// 		// 	accountUserId:req.session.user.id,
// 		// }
// 	  ]
// 	},
	
//   });
//   //console.log(record[0])
//   const user=req.session.user
//   console.log("FAdsskjfskjd",user)
  
//   res.render("employee/editAll",{user,record:record.length ? record[0] : {}})
// };
// /////////////////to update from edit form verification:verification,

// exports.editOrderAccount= async(req,res)=>{
// 	console.log("----------------------------------------------",req.body.cost)
// 	try {
// 		const {
// 			orderId,
// 			amazonComments,
// 		  amazonAccount,
// 		  orderDate,
// 		  shipBy,
// 		  deliverBy,
// 		  purchaseDate,
// 		  contactBuyer,
// 		  customerType,
// 		  distributor,
// 		  mfrName,
// 		  sku,
// 		  quantity,
// 		  price,
// 		  tax,
// 		  shippingFee,
// 		  amazonFee,
// 		  mft,
// 		  yourEarning,
// 		  cost,
// 		  freightCost,
// 		  handlingFee,
// 		  shippingAddress,
// 		  addressType,
// 		  phone,
// 		  companyPhone,
// 		  email,
// 		  sixSeries,
		  
// 		  status,
// 		  po,
// 		  payment,
// 		  processedAccount,
// 		  invoiceNo,
// 		  billNo,
// 		  trackingNo,
// 		  invoiceDate,
// 		  billDate,
// 		  shippingDiscount,
// 		  insurance,
// 		  salesTax,
// 		  creditMemo,
// 		  miscFee,
// 		  resoldRevenue,
// 		  verification,
// 		  id,
// 		  orderDateAccount,
// 		  accountComments		} = req.body;
// 		  console.log(status,'ssssssssssssssssssssssssssssssssss')
// 		//console.log("=====+=======", req.body);
// 		// Update the order with the given ID
// 		const updatedOrder = await Orders.update(
// 			{
// 			orderId,
// 			amazonComments,
// 			accountComments,
// 			amazonAccount,
// 			orderDate,
// 			shipBy,
// 			deliverBy,
// 			purchaseDate,
// 			contactBuyer,
// 			customerType,
// 			distributor,
// 			mfrName: mfrName,
// 			sku,
// 			quantity,
// 			price,
// 			tax,
// 			shippingFee,
// 			amazonFee,
// 			mft,
// 			yourEarning,
// 			cost,
// 			freightCost,
// 			handlingFee,
// 			shippingAddress,
// 			addressType,
// 			phone,
// 			companyPhone,
// 			email,
			
			
// 			status:status,
// 			poNumber: po,
// 			paymentTerm: payment,
	  
// 			payment,
// 			processedAccount: processedAccount,
// 			invoiceNo: invoiceNo,
// 			billNo: billNo,
	  
// 			trackingNo: trackingNo,
// 			invoiceDate: invoiceDate,
// 			billDate: billDate,
// 			shippingDiscount,
// 			insurance: insurance,
// 			saleTax: salesTax,
// 			creditMemo: creditMemo,
// 			miscFee: miscFee,
// 			resoldRevenue: resoldRevenue,
// 			verificationStatus: verification,
// 			poSixSeries: sixSeries,
// 			orderDateAccount: orderDateAccount
// 		  },
// 		  {
// 			where: {
// 			  id: id // Replace someValue with the value you're looking for
// 			},
// 			returning: true,
// 		  }
// 		);

// 		res.redirect("/employee/")
// 			// The rupdate was successful (updated 1 record)
	
		  
// 		}catch (error) {
// 			console.error(error);
// 			return res.status(500).json({ status: false, error: "Error updating order" });
// 		  }

// };
// // exports.generatePo= async(req,res)=>{

// // 	try {
		
// // 		let lastGeneratedNumber =await Orders.findOne({
// // 			where: {
// // 			  poNumber: {
// // 				[Op.ne]: null // Check for non-null values in the poNumber column
// // 			  },
// // 			  distributor: {
// // 				[Op.ne]: 'TXWH', // Use [Op.ne] for "not equal to"
// // 			  },
// // 			},
// // 			limit: 1,
// // 			order: [['poDate', 'DESC']] // Use an array for the order definition
// // 		  });
// // 		let order = await Orders.findOne({where:{id : req.query.orderId}})
// // 		console.log("+++++++++++++++++++++++++++++++++++++++++++++++++",lastGeneratedNumber,order.poNumber)
// // 		if(!lastGeneratedNumber){
// // 			console.log("yeeeeen meeeeeen")
// // 			lastGeneratedNumber=300000000
// // 			const amazon = order.amazonAccount;
// // 			const amazonAccount= amazon.includes("Tech") ? "Tech" : "Choice";
// // 			let distri = order.distributor
// // 			let distributor = distri.includes("Tech") ? "Tech" : "Choice";
	
// // 			console.log("fdsadfs")
// // 			if ((amazonAccount === "Tech" && distributor === "Choice") || (amazonAccount === "Tech" && distributor === "Tech" )) {
// // 			  lastGeneratedNumber = lastGeneratedNumber + 1
// // 			  lastGeneratedNumber = 'AMZ-' + lastGeneratedNumber
			  
// // 			}
// // 			else if ((amazonAccount === "Choice" && distributor === "Choice") || (amazonAccount === "Choice" && distributor === "Tech" )) {
// // 				lastGeneratedNumber = lastGeneratedNumber + 1
// // 			}
			
// // 			else if(distributor=="TXWH"){
// // 				lastGeneratedNumber = ''
// // 			}
// // 			else{
// // 				lastGeneratedNumber = ''
// // 			}
// // 			console.log("fdsadfs2")
			
// // 			if(lastGeneratedNumber){
// // 				await Orders.update({poNumber : lastGeneratedNumber,poDate:new Date()}, {where : {id : req.query.orderId}})
// // 			}
// // 			console.log("fdsadfs3")
// // 			return await res.json({status:true, lastGeneratedNumber})
			
// // 		}
// // 		if(!order.poNumber){
// // 			console.log("adnaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaananananannan")
// // 			lastGeneratedNumber =  lastGeneratedNumber.poNumber
// // 			  console.log(lastGeneratedNumber)
// // 			if(lastGeneratedNumber.includes('AMZ-')){
// // 				lastGeneratedNumber = + lastGeneratedNumber.split('AMZ-')[1]
// // 			}else{
// // 				lastGeneratedNumber=+lastGeneratedNumber
// // 			}
// // 			console.log(lastGeneratedNumber)
		
		
		
// // 			const amazon = order.amazonAccount;
// // 			const amazonAccount= amazon.includes("Tech") ? "Tech" : "Choice";
// // 			let distri = order.distributor
// // 			let distributor = distri.includes("Tech") ? "Tech" : "Choice";
	
// // 			console.log("fdsadfs")
// // 			if (amazonAccount === "Tech" && distributor === "Choice" || amazonAccount === "Tech" && distributor === "Tech" ) {
// // 			  lastGeneratedNumber = lastGeneratedNumber + 1
// // 			  lastGeneratedNumber = 'AMZ-' + lastGeneratedNumber
			  
// // 			}
// // 			else if (amazonAccount === "Choice" && distributor === "Choice" || amazonAccount === "Choice" && distributor === "Tech" ) {
// // 				lastGeneratedNumber = lastGeneratedNumber + 1
// // 			}
// // 			else if(distributor=="TXWH"){
// // 				lastGeneratedNumber = ''
// // 			}
// // 			else{
// // 				lastGeneratedNumber = ''
// // 			}
		
// // 			if(lastGeneratedNumber){
// // 				await Orders.update({poNumber : lastGeneratedNumber,poDate:new Date()}, {where : {id : req.query.orderId}})
// // 			}
// // 			console.log("fdsadfs3")
// // 			res.json({status : true, lastGeneratedNumber})
// // 		}else{
// // 			res.json({status : false,})
// // 		}
		
// // 	}
// // 	catch (error) {
// // 		console.log(error)
// // 		res.json({status : false,})
// // 	}
// // }
// exports.rating= async(req,res)=>{
// 	const { orderId, score } = req.body;
	
// 	let record = await Orders.findOne({
// 		where:{ id: orderId },});

//   console.log("+++++",orderId,record[0])
// 	if (record) {
// 	  if (record.rating == 0) {
// 		// If the rating is empty or null, set the new score
// 		record.rating = score;
// 		// Save the updated record to the database
// 		await record.save();
// 		res.json({ status: true });
// 	  } else {
// 		// Rating already exists, send a response indicating failure
// 		res.json({ status: false });
// 	  }
// 	} else {
// 	  // No record found for the given orderId
// 	  res.status(404).json({ status: false, message: 'Order not found' });
// 	}
// }
// exports.duplicateOrder= async(req,res)=>{
//     let id=req.params.id
// 	const order = await Orders.findOne({
// 		where: { id: id }
// 	  });
// 	 const user=req.session.user
// 	  if (order) {
// 		// The order with id 1 was found
// 		const orderid= order.orderId+"-D"
		
// res.render("employee/addOrder",{order,orderid,user,page:"dashboard"})
// 	  } else {
// 		// No order with id 1 was found
// 		console.log('Order not found');
// 	  } 
// }
   
