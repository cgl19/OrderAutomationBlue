
const bcrypt = require("bcryptjs");
const db = require("../models");
const helpers = require("../helpers/helpers");
const validator = require("validator");
const e = require("connect-flash");
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const path = require('path');
const { json } = require("body-parser");
const { Orders, Users, Powers, UserPowers } = db;
const { Op, where } = require("sequelize");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const express = require('express');
const readXlsxFile = require("read-excel-file/node");
const excel = require('exceljs');
const { log } = require("console");



exports.profile = async (req, res) => {
	res.render("amazonView");
}




// this route is responsible to redirect to amazon dashboard view
exports.root = async (req, res) => {
	const statusMessage = req.query?.message? req.query?.message:'';
	console.log(statusMessage)
	console.log('.................');

	try {
		const userId = req.session.user.id;

		const assigned = await Orders.findAll({
			where: {

				[Op.or]: [
					{ amazonUserId: userId },
					{ accountUserId: userId }
				]

			}
		});
		const completedOrders = await Orders.findAll({
			where: {
				[Op.and]: [
					{
						[Op.or]: [
							{ amazonUserId: userId },
							{ accountUserId: userId }
						]
					},
					{
						status: {
							[Op.in]: ['completed', 'on-hold']
						}
					}
				]
			}
		});


		const pendingOrder = await Orders.findAll({
			where: {
				[Op.and]: [
					{
						[Op.or]: [
							{ amazonUserId: userId },
							{ accountUserId: userId }
						]
					},
					{
						status: "pending"
					}
				]
			},
			include: [
				{
					model: Users, // replace with the actual model name
					as: 'amazonUser', // replace with the appropriate association alias
					attributes: ['name'] // replace 'name' with the actual attribute name
				}
			]
		});


		//finding the completed and pending order in single query 
		const pendingAndCompleted = await Orders.findAll({
			where: {
				[Op.and]: [
					{
						[Op.or]: [
							{ amazonUserId: userId },
							{ accountUserId: userId }
						]
					},
					{
						status: {
							[Op.in]: ['completed', 'pending']
						}
					}
				]
			},
			include: [
				{
					model: Users,
					as: 'amazonUser',
					attributes: ['name']
				},
				{
					model: Users,
					as: 'accountUser', // Assuming you have an association named 'accountUser' in the Orders model
					attributes: ['name'] // Replace 'name' with the actual attribute name for the user's name
				}
			],
			order: [['createdAt', 'DESC']]
		});






		let employeesData = await Users.findAll({
			where: {
				role: 'employee',
			},
			include: [
				{
					model: Powers,
				}

			]
		});

		let userid = req.session.user.id;
		let user = await Users.findByPk(userid, {
			include: [
				{
					model: Powers,
					through: UserPowers,
					as: 'Powers', // Assuming your association is named "Powers"
				},
			],
		});



		const userPowers = user.Powers; // This will be an array of powers

		const assignedCount = assigned.length;
		const completedOrderCount = completedOrders.length;
		//console.log(employeesData)


		res.render("amazon/dashboard", {statusMessage, pendingAndCompleted, pendingOrder, assignedCount, completedOrderCount, employeesData, userPowers, user });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("An error occurred");
	}
};






//this routes is used to return the view to amazon user to add Order
exports.ordersAdd = async (req, res) => {
	let order
	let orderid
	res.render("amazon/addOrder", { order, orderid });
};



exports.orderPaginate = async (req, res) => {
	const { iDisplayLength, sEcho, sSearch, iDisplayStart } = JSON.parse(
		JSON.stringify(req.body)
	); console.log(" ssersch ");
	var pageNo = parseInt(sEcho);
	var size = parseInt(iDisplayLength);
	var query = {};
	if (pageNo < 0 || pageNo === 0) {
		response = {
			error: true,
			message: "invalid page number, should start with 1",
		};
		return res.json(response);
	}
	query.offset = parseInt(iDisplayStart);
	query.limit = size;
	console.log("ssersch",);
	if (sSearch) {
		console.log("ssersch",);
		Orders.findAll({
			where: {
				[Op.or]: [
					{ orderId: { [Op.substring]: sSearch } },
					{ poNumber: { [Op.substring]: sSearch } },
					{ email: { [Op.substring]: sSearch } },
					{ createdAt: { [Op.substring]: sSearch } },
					{ status: { [Op.substring]: sSearch } },
				],

			},
			include: [
				{
					model: Users,
					as: 'amazonUser', // Replace with the appropriate association alias
					attributes: ['name']
				}, {
					model: Users,
					as: 'accountUser', // Replace with the appropriate association alias
					attributes: ['name']
				}
			],
			order: [['createdAt', 'DESC']],
			offset: parseInt(iDisplayStart) < 1 ? 0 : parseInt(iDisplayStart),
			limit: parseInt(iDisplayLength),
		})
			.then(async (data) => {
				let skodaJsonDataArr = new Array();
				for (let i = 0; i < data.length; i++) {

					let dataObj = new Object();
					if (data[i].orderId != undefined) {
						dataObj.orderId = data[i].orderId;
					} else {
						dataObj.orderId = "";
					}
					if (data[i].poNumber != undefined) {
						dataObj.poNumber = data[i].poNumber;
					} else {
						dataObj.poNumber = "";
					}

					dataObj.email = data[i].email ? data[i].email : ""

					dataObj.status = data[i].status ? data[i].status : ""

					dataObj.createdAt = data[i].createdAt ? data[i].createdAt : ""


					// dataObj.edit = `<a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a>`

					// dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a> `
					dataObj.details = `<a class="btn btn-dark" href="/amazon/amazonEdit/${data[i].id}">Details</a><a class="btn btn-primary mx-1" href="/amazon/amazonEdit/${data[i].id}">Edit</a> `


					dataObj.amazonUserName = data[i]?.amazonUser?.name || "";
					dataObj.accountUserName = data[i]?.accountUser?.name || "";

					dataObj.createdBy = dataObj.amazonUserName ? dataObj.amazonUserName : "";
					dataObj.processedBy = dataObj.accountUserName ? dataObj.accountUserName : "";

					skodaJsonDataArr.push(dataObj);
				}
				response = skodaJsonDataArr;
				Orders.count({
					where: {
						[Op.or]: [
							{ orderId: { [Op.substring]: sSearch } },
							{ poNumber: { [Op.substring]: sSearch } },
							{ email: { [Op.substring]: sSearch } },
							{ createdAt: { [Op.substring]: sSearch } },
							{ status: { [Op.substring]: sSearch } },
						],
					},
				})
					.then((count) => {
						res.send({
							draw: sEcho,
							recordsTotal: count,
							recordsFiltered: count,
							data: response,
						});
					})
					.catch((err) => {
						if (err) console.log(err);
					});
			})
			.catch((e) => {
				console.log(sSearch);
				response = {
					error: true,
					e,
					message: "Error fetching data",

				};

				Orders.count()
					.then((count) => {
						res.send({
							draw: sEcho,
							recordsTotal: count,
							recordsFiltered: count,
							data: response,
						});
					})
					.catch((err) => {
						if (err) console.log(err);
					});
			});
	} else {
		//console.log("!!!ssersch");
		user = req.session.user.id
		Orders.findAll({
			...query,
			where: {
				status: {
					[Op.in]: ['completed', 'on-hold', 'cancelled'],
				},
				accountUserId: user
			},
			include: [
				{
					model: Users,
					as: 'amazonUser', // Replace with the appropriate association alias
					attributes: ['name']
				},
			],
			order: [['createdAt', 'DESC']],
		})
			.then(async (data) => {
				let skodaJsonDataArr = new Array();
				for (let i = 0; i < data.length; i++) {

					let dataObj = new Object();
					if (data[i].orderId != undefined) {
						dataObj.orderId = data[i].orderId;
					} else {
						dataObj.orderId = "";
					}
					if (data[i].poNumber != undefined) {
						dataObj.poNumber = data[i].poNumber;
					} else {
						dataObj.poNumber = "";
					}

					dataObj.amazonUserName = data[i]?.amazonUser?.name || "";
					dataObj.accountUserName = data[i]?.accountUser?.name || "";

					dataObj.email = data[i].email ? data[i].email : ""

					dataObj.status = data[i].status ? data[i].status : ""

					dataObj.createdAt = data[i].createdAt ? data[i].createdAt : ""


					dataObj.details = `<a class="btn btn-dark" href="/employee/amazonEdit/${data[i].id}">Details</a><a class="btn btn-primary mx-1" href="/employee/amazonEdit/${data[i].id}">Edit</a> `

					dataObj.createdBy = dataObj.amazonUserName ? dataObj.amazonUserName : "";



					skodaJsonDataArr.push(dataObj);
				}
				response = skodaJsonDataArr;
				Orders.count({})
					.then((count) => {
						res.send({
							draw: sEcho,
							recordsTotal: count,
							recordsFiltered: count,
							data: response,
						});
					})
					.catch((err) => {
						if (err) console.log(err);
					});
			})
			.catch((e) => {
				//console.log(e);
				response = {
					error: true,
					e,
					message: "Error fetching data",
				};


				Orders.count()
					.then((count) => {
						res.send({
							draw: sEcho,
							recordsTotal: count,
							recordsFiltered: count,
							data: response,
						});
					})
					.catch((err) => {
						if (err) console.log(err);
						else {
						}
					});
			});
	}
};





exports.orderPaginateAmazon = async (req, res) => {
	const { iDisplayLength, sEcho, sSearch, iDisplayStart } = JSON.parse(
		JSON.stringify(req.body)
	);
	var pageNo = parseInt(sEcho);
	var size = parseInt(iDisplayLength);
	var query = {};
	if (pageNo < 0 || pageNo === 0) {
		response = {
			error: true,
			message: "invalid page number, should start with 1",
		};
		return res.json(response);
	}
	query.offset = parseInt(iDisplayStart);
	query.limit = size;

	if (sSearch) {
		//console.log("ssersch");
		Orders.findAll({
			where: {
				[Op.or]: [
					{ orderId: { [Op.substring]: sSearch } },
					{ poNumber: { [Op.substring]: sSearch } },
					{ email: { [Op.substring]: sSearch } },
					{ createdAt: { [Op.substring]: sSearch } },
					{ status: { [Op.substring]: sSearch } },
				],
			},
			include: [
				{
					model: Users,
					as: 'amazonUser', // Replace with the appropriate association alias
					attributes: ['name']
				}, {
					model: Users,
					as: 'accountUser', // Replace with the appropriate association alias
					attributes: ['name']
				}
			],
			order: [['createdAt', 'DESC']],
			offset: parseInt(iDisplayStart) < 1 ? 0 : parseInt(iDisplayStart),
			limit: parseInt(iDisplayLength),
		})
			.then(async (data) => {
				let skodaJsonDataArr = new Array();
				for (let i = 0; i < data.length; i++) {

					let dataObj = new Object();
					if (data[i].orderId != undefined) {
						dataObj.orderId = data[i].orderId;
					} else {
						dataObj.orderId = "";
					}
					if (data[i].poNumber != undefined) {
						dataObj.poNumber = data[i].poNumber;
					} else {
						dataObj.poNumber = "";
					}

					dataObj.email = data[i].email ? data[i].email : ""

					dataObj.status = data[i].status ? data[i].status : ""

					if(data[i]?.createdAt){
						const date = new Date(data[i]?.createdAt); // Replace with your date
						const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
						const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

						const formattedDate = date.toLocaleDateString(undefined, dateOptions);
						const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

						const formattedDateTime = `${formattedDate} ${formattedTime}`;
						dataObj.createdAt = formattedDateTime
					}else{
						dataObj.createdAt = ''
					}
					dataObj.rating = data[i].rating ? data[i].rating : ""


					if (data[i].status == "completed")
					 { 
						dataObj.details = `<div class="btn-group" role="group" aria-label="Order Actions">
						<a class="btn btn-primary btn-sm" href="/amazon/amazonOrderDetail/${data[i].id}">Details</a>
						<a class="btn btn-warning btn-sm mx-1" href="/amazon/duplicateOrder/${data[i].id}">Duplicate</a>
					</div> ` 
					} 
					else {
						dataObj.details = ` <div class="btn-group" role="group" aria-label="Order Actions">
						<a class="btn btn-primary btn-sm" href="/amazon/amazonOrderDetail/${data[i].id}">Details</a>
						<a class="btn btn-success btn-sm mx-1" href="/amazon/amazonEdit/${data[i].id}">Edit</a>
						<a class="btn btn-warning btn-sm" href="/amazon/duplicateOrder/${data[i].id}">Duplicate</a>
					</div>  `
					}

					dataObj.amazonUserName = data[i]?.amazonUser?.name || "";
					dataObj.accountUserName = data[i]?.accountUser?.name || "";

					dataObj.createdBy = dataObj.amazonUserName ? dataObj.amazonUserName : "";
					dataObj.processedBy = dataObj.accountUserName ? dataObj.accountUserName : "";


					skodaJsonDataArr.push(dataObj);
				}
				response = skodaJsonDataArr;
				Orders.count({
					where: {
						[Op.or]: [
							{ orderId: { [Op.substring]: sSearch } },
							{ poNumber: { [Op.substring]: sSearch } },
							{ email: { [Op.substring]: sSearch } },
							{ createdAt: { [Op.substring]: sSearch } },
							{ status: { [Op.substring]: sSearch } },
						],
					},
				})
					.then((count) => {
						res.send({
							draw: sEcho,
							recordsTotal: count,
							recordsFiltered: count,
							data: response,
						});
					})
					.catch((err) => {
						if (err) console.log(err);
					});
			})
			.catch((e) => {
				console.log(e);
				response = {
					error: true,
					e,
					message: "Error fetching data",
				};

				Orders.count()
					.then((count) => {
						res.send({
							draw: sEcho,
							recordsTotal: count,
							recordsFiltered: count,
							data: response,
						});
					})
					.catch((err) => {
						if (err) console.log(err);
					});
			});
	} else {
		//console.log("!!!ssersch");
		const userId = req.session.user.id;
		Orders.findAll({
			...query,
			include: [
				{
					model: Users,
					as: 'amazonUser', // Replace with the appropriate association alias
					attributes: ['name']
				}, {
					model: Users,
					as: 'accountUser', // Replace with the appropriate association alias
					attributes: ['name']
				}

			],
			order: [['createdAt', 'DESC']],
			// where: {
			// 	accountUserId: userId
			//   }
		})
			.then(async (data) => {
				let skodaJsonDataArr = new Array();
				for (let i = 0; i < data.length; i++) {

					let dataObj = new Object();
					if (data[i].orderId != undefined) {
						dataObj.orderId = data[i].orderId;
					} else {
						dataObj.orderId = "";
					}
					if (data[i].poNumber != undefined) {
						dataObj.poNumber = data[i].poNumber;
					} else {
						dataObj.poNumber = "";
					}

					dataObj.amazonUserName = data[i]?.amazonUser?.name || "";
					dataObj.accountUserName = data[i]?.accountUser?.name || "";


					dataObj.email = data[i].email ? data[i].email : ""

					dataObj.status = data[i].status ? data[i].status : ""

					if(data[i]?.createdAt){
						const date = new Date(data[i]?.createdAt); // Replace with your date
						const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
						const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

						const formattedDate = date.toLocaleDateString(undefined, dateOptions);
						const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

						const formattedDateTime = `${formattedDate} ${formattedTime}`;
						dataObj.createdAt = formattedDateTime
					}else{
						dataObj.createdAt = ''
					}

					dataObj.rating = data[i].rating ? `<div class='ratingDiv' data-score='${data[i].rating}' data-orderid='${data[i].id}'></div>` : `<div class='ratingDiv' data-score='0' data-orderid='${data[i].id}'></div>`


					if (data[i].status == "completed") {
						dataObj.details = `
						<a class="btn btn-primary btn-sm btn-details" href="/amazon/amazonOrderDetail/${data[i].id}">Detail</a>
						<a class="btn btn-warning btn-sm btn-duplicate mx-1" href="/amazon/duplicateOrder/${data[i].id}">Duplicate</a>
						`;
					} else {
						dataObj.details = `
						<div class="btn-group btn-group-sm" role="group" aria-label="Order Actions">
						<a class="btn btn-primary btn-sm btn-details" href="/amazon/amazonOrderDetail/${data[i].id}">Detail</a>
						<a class="btn btn-success btn-sm btn-edit mx-1" href="/amazon/amazonEdit/${data[i].id}">Edit</a>
						<a class="btn btn-warning btn-sm btn-duplicate" href="/amazon/duplicateOrder/${data[i].id}">Duplicate</a>
					</div>
						`;
					}

					dataObj.createdBy = dataObj.amazonUserName ? dataObj.amazonUserName : "";
					dataObj.processedBy = dataObj.accountUserName ? dataObj.accountUserName : "";



					skodaJsonDataArr.push(dataObj);
				}
				response = skodaJsonDataArr;
				Orders.count({})
					.then((count) => {
						res.send({
							draw: sEcho,
							recordsTotal: count,
							recordsFiltered: count,
							data: response,
						});
					})
					.catch((err) => {
						if (err) console.log(err);
					});
			})
			.catch((e) => {
				//console.log(e);
				response = {
					error: true,
					e,
					message: "Error fetching data",
				};


				Orders.count()
					.then((count) => {
						res.send({
							draw: sEcho,
							recordsTotal: count,
							recordsFiltered: count,
							data: response,
						});
					})
					.catch((err) => {
						if (err) console.log(err);
						else {
						}
					});
			});
	}
};










exports.addFile = async (req, res) => {
	try {
		const files = req.files; // 'files' should be the property name corresponding to the input field name

		const uploadedFiles = [];

		for (const key of Object.keys(files)) {
			const file = files[key];

			if (file.mimetype !== "application/pdf") {
				return res.status(400).json({ error: "Only PDF files are allowed." });
			}

			const pathToFile =
				path.join(__dirname, "../public/files", `${Date.now()}_${file.name}`);
			await file.mv(pathToFile);

			const prefixToRemove = '/root/OrderAutomation/public/files/';

			const trimmedFilePath = pathToFile.replace(new RegExp(`^${prefixToRemove}`), '');
			uploadedFiles.push(trimmedFilePath);
		}

		const fileNamesString = uploadedFiles.join(", ");
		//console.log(fileNamesString)
		res.json({ fileNamesString });
	} catch (error) {
		//console.log("Error:", error.message);
		res.status(500).json({ error: "An error occurred." });
	}
};








exports.addOrderProcess = async (req, res) => {
	try {

		const {

			orderId,
			comments,
			amazonAccount,
			orderDate,
			shipBy,
			deliverBy,
			purchaseDate,
			contactBuyer,
			customerType,
			distributor,
			mfrName,
			skus,
			quantity,
			price,
			tax,
			shippingFee,
			amazonFee,
			mft,
			yourEarnings,
			cost,
			freightCost,
			handlingFee,
			shippingAddress,
			addressType,
			phone,
			companyPhone,
			email,
			filename,

		} = req.body;
		console.log(amazonAccount)
		//console.log("============",req.body.filename)

		// Create the order
		const order = await Orders.create({
			orderId,
			amazonComments: comments,
			amazonAccount,
			orderDate,
			shipBy,
			deliverBy,
			purchaseDate,
			contactBuyer,
			customerType,
			distributor,
			mfrName: mfrName,
			sku: skus,
			quantity,
			price,
			tax,
			shippingFee,
			amazonFee,
			mft,
			yourEarning: yourEarnings,
			cost,
			freightCost,
			handlingFee,
			shippingAddress,
			addressType,
			phone,
			companyPhone,
			email,
			amazonUserId: req.session.user.id,
			filename,

		});

		return res.status(201).json({
			message: "Order created successfully",
			orderId: order.orderId, // Send the orderId from the created order
			amazonUserId: order.amazonUserId,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	}

};










exports.sendMailAmazon = async (req, res) => {
	const { orderId, amazonUserId } = req.body;

	const amazonUserIdToLookup = amazonUserId; // Replace with the actual amazonUserId you have
	let USER = await Users.findOne({
		where: {
			id: amazonUserIdToLookup,
		},
	})

	let userName = ""; // Initialize userName

	if (USER) {
		userName = USER.name; // Assign the user's name if found
	} else {
		userName = amazonUserId; // Use amazonUserId as the name if user not found
	}

	try {
		// Create the transporter
		const transporter = nodemailer.createTransport({
			host: 'in-v3.mailjet.com',
			port: 587,
			auth: {
				user: '8ae0660a50d9e557cceeb6c5fd2a9ff9',
				pass: '1379ad630084466ed118f6ea6f983366'
			}
		});

		// Construct the email content
		const emailContent = `New order created\nOrder ID: ${orderId}\n By Amazon User : ${userName}\n\n\nThis project is not maintained anymore due to lack of budget.For any inconvenience Please Visit HR. `;

		// Send the email
		const emailResponse = await transporter.sendMail({
			from: 'noreply@vcloudtech.info',
			to: 'hamzawaleed511@gmail.com',
			subject: 'New Order Created',
			text: emailContent
		});  
		//console.log('Email Response:', emailResponse);
		return res.status(200).json({ message: 'Email sent successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	}
}
exports.sendEmailAccount = async (req, res) => {
	const { orderid, userid, status } = req.body;

	try {
		// Create the transporter
		const transporter = nodemailer.createTransport({
			host: 'in-v3.mailjet.com',
			port: 587,
			auth: {
				user: '8ae0660a50d9e557cceeb6c5fd2a9ff9',
				pass: '1379ad630084466ed118f6ea6f983366'
			}
		});

		// Construct the email content
		const emailContent = `A Task Has Been ${status} \n By Account User ID: ${userid}\nOrder ID: ${orderid}\n\n\nThis project is not being maintained anymore due to lack of budget.For any inconvenience Please Visit HR. `;

		// Send the email
		const emailResponse = await transporter.sendMail({
			from: 'noreply@vcloudtech.info',
			to: 'muhammadmuhib60@gmail.com',
			subject: 'Status Updated',
			text: emailContent
		});
		//console.log('Email Response:', emailResponse);
		return res.status(200).json({ message: 'Email sent successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Error sending email' });
	}
};







exports.exportOrders = async (req, res) => {
	//console.log('export data',req.body);
	let { fromDate, toDate, employees, status } = req.body;
	fromDate = new Date(fromDate)
	toDate = new Date(new Date(toDate).setHours(23, 59, 59))
	try {
		const exportOrders = await Orders.findAll({
			attributes: [
				"id", // Include any other attributes you need in this array
				"poDate",
				"deliverBy",
				"deliveredDate",
				"trackingNo",
				"accountComments",
				"verificationStatus",
				"processedAccount",
				"poSixSeries",
				"poNumber",
				"status",
				"orderId",
				"sku",
				"invoiceNo",
				"billNo",
				"shippingAddress",
				"mfrName",
				"distributor",
				"paymentTerm",
				"cost",
				"shippingDiscount",
				"handlingFee",
				"saleTax",
				"insurance",
				"creditMemo",
				"miscFee",
				"resoldRevenue",
			],
			where: {
				createdAt: {
					[Op.between]: [fromDate, toDate], // Use the between operator
				},
				[Op.or]: [
					{
						amazonUserId: { [Op.in]: employees }
					},
					{
						accountUserId: { [Op.in]: employees }
					}
				],
				status: { [Op.in]: status }
			},
			include: [
				{
					model: Users,
					as: 'accountUser',
				},
				{
					model: Users,
					as: 'amazonUser',
				},
			],


			// ... include options
		});

		



		const generateRowsForOneOrder = (order) => {

			//console.log("++++",order)
			const rows = [];
			const skus = order.sku.split('|');
			for (let index = 0; index < skus.length; index++) {
				let row = '';
				for (const key in order) {
					if (order.hasOwnProperty(key) && key !== 'id') {
						if (key === "sku") {
							row += skus[index] + "#&a";
						} else if (key === "amazonUser") {
							row += order.amazonUser.dataValues.name;
						} else if (key === "accountUser") {
							row += order?.accountUser ? order?.accountUser?.dataValues?.name + "#&a" : "#&a";
						}
						else if (key === "quantity") {
							row += order.quantity.split('|')[index] + "#&a";
						}
						else if (key === "price") {
							row += order.price.split('|')[index] + "#&a";
						}
						else if (key === "cost") {
							row += order.cost.split('|')[index] + "#&a";
						}
						else if (key === "tax") {
							row += order.tax.split('|')[index] + "#&a";
						}
						else if (key === "shippingFee") {
							row += order.shippingFee.split('|')[index] + "#&a";
						}
						else if (key === "handlingFee") {
							row += order.handlingFee.split('|')[index] + "#&a";
						}
						else if (key === "mft") {
							row += order.mft.split('|')[index] + "#&a";
						} else if (key === "freightCost") {
							row += order.freightCost.split('|')[index] + "#&a";
						}
						else if (key === "amazonFee") {
							row += order.amazonFee.split('|')[index] + "#&a";
						}
						else if (key === "yourEarning") {
							row += order.yourEarning.split('|')[index] + "#&a";
						}

						else {

							row += order[key] + "#&a";
						}
					}
				}

				rows.push(row);
			}

			return rows;
		};


		function generateHeadersForExportFile(order) {
			let headers = [];
			for (const key in order) {
				if (order.hasOwnProperty(key) && key !== 'id') {
					headers.push({ header: key, key: key });
				}
			}
			//   //console.log(headers)
			headers = [
				{ header: 'po Date', key: 'poDate' },
				{ header: 'deliverBy', key: 'deliverBy' },
				{ header: 'deliveredDate', key: 'deliveredDate' },
				{ header: 'trackingNo', key: 'trackingNo' },
				{ header: 'accountComments', key: 'accountComments' },
				{ header: 'verificationStatus', key: 'verificationStatus' },

				{ header: 'processedAccount', key: 'processedAccount' },
				{ header: 'poSixSeries', key: 'poSixSeries' },
				{ header: 'poNumber', key: 'poNumber' },
				{ header: 'status', key: 'status' },
				{ header: 'orderId', key: 'orderId' },
				{ header: 'sku', key: 'sku' },
				{ header: 'invoiceNo', key: 'invoiceNo' },
				{ header: 'billNo', key: 'billNo' },
				{ header: 'shippingAddress', key: 'shippingAddress' },
				{ header: 'mfrName', key: 'mfrName' },
				{ header: 'distributor', key: 'distributor' },
				{ header: 'paymentTerm', key: 'paymentTerm' },
				{ header: 'cost', key: 'cost' },
				{ header: 'shippingDiscount', key: 'shippingDiscount' },
				{ header: 'handlingFee', key: 'handlingFee' },
				{ header: 'saleTax', key: 'saleTax' },
				{ header: 'insurance', key: 'insurance' },
				{ header: 'creditMemo', key: 'creditMemo' },
				{ header: 'miscFee', key: 'miscFee' },
				{ header: 'Signature Fee', key: 'resoldRevenue' },
				{ header: 'Purchasing Rep', key: 'accountUser' },
				{ header: 'Amazon Rep', key: 'amazonUser' },
				{ header: 'Outbound Shipping', key: 'Outbound Shipping' },
				{ header: 'Net Outbound Shipping (for QB)', key: 'Net Outbound Shipping (for QB)' }
			]
			return headers;
		}


		const workbook = new excel.Workbook();
		workbook.creator = 'Your Name';
		workbook.lastModifiedBy = 'Your Name';
		workbook.created = new Date();
		workbook.modified = new Date();

		const worksheet = workbook.addWorksheet('Sheet 1');

		const headers = generateHeadersForExportFile(exportOrders[0]?.dataValues)
		worksheet.columns = headers;
		const filePath = path.join(__dirname, '../export/account', 'file.xlsx');
		//fs.writeFileSync(filePath,'')
		for (let index = 0; index < exportOrders.length; index++) {
			const order = exportOrders[index];
			const dataValues = order.dataValues;

			let concatenatedString = '';
			let rows


			rows = await generateRowsForOneOrder(dataValues);

			for (let index = 0; index < rows.length; index++) {




				const splitArray = rows[index].split('#&a');
				// splitArray.shift();

				worksheet.addRow(splitArray);
			}

		}


		workbook.xlsx.writeFile(filePath)
			.then(() => {
				//console.log('Excel file created successfully.');
			})
			.catch((error) => {
				console.error('Error creating Excel file:', error);
			});



	}




	catch (error) {
		console.error('Error exporting orders:', error);
		res.status(500).send('An error occurred while exporting orders.');
	}
};



// downloading the excel 
//on the same ajax call which is exporting the record  on client side  another function runs
exports.downloadCsv = (req, res) => {
	const filePath = path.join(__dirname, '../export/account', 'file.xlsx'); // Assuming file.csv is in the root directory
	//console.log('Downloading the File');
	res.download(filePath, 'file.xlsx', (err) => {
		if (err) {
			res.status(500).send('Error downloading the file.');
		}
	});
};




exports.amazonOrderDetail = async (req, res) => {
	const orderId = req.params.orderid;

	const record = await Orders.findAll({
		where: {
			[Op.and]: [
				{
					id: orderId,
				},
			],
		},
	});
	console.log(record[0])
	res.render("amazon/amazonOrderDetailView", { record: record.length ? record[0] : {} })
};



exports.amazonEdit = async (req, res) => {
	const editMessage = req.query?.message? req.query?.message:'';
	console.log(editMessage)
	console.log('.................');
	const id = req.params.id
	const record = await Orders.findAll({
		where: {
			[Op.and]: [
				{
					id
				},
			]
		},

	});
	const user = req.session.user
	res.render("amazon/amazonEdit", {editMessage, user, record: record.length ? record[0] : {} })
};




/////////////////to update from edit form verification:verification,
exports.amazonEditOrder = async (req, res) => {
	let oId

	try {
		const {
			orderId,
			amazonComments,
			amazonAccount,
			orderDate,
			shipBy,
			deliverBy,
			purchaseDate,
			contactBuyer,
			customerType,
			distributor,
			mfrName,
			sku,
			quantity,
			price,
			tax,
			shippingFee,
			amazonFee,
			mft,
			yourEarning,
			cost,
			freightCost,
			handlingFee,
			shippingAddress,
			addressType,
			phone,
			companyPhone,
			email,
			sixSeries,

			status,
			po,
			payment,
			processedAccount,
			invoiceNo,
			billNo,
			trackingNo,
			invoiceDate,
			billDate,
			shippingDiscount,
			insurance,
			salesTax,
			creditMemo,
			miscFee,
			resoldRevenue,
			verification,
			id,
			orderDateAccount,
			accountComments } = req.body;
			

			oId=id;
		const updatedOrder = await Orders.update(
			{
				orderId,
				amazonComments,
				accountComments,
				amazonAccount,
				orderDate,
				shipBy,
				deliverBy,
				purchaseDate,
				contactBuyer,
				customerType,
				distributor,
				mfrName: mfrName,
				sku,
				quantity,
				price,
				tax,
				shippingFee,
				amazonFee,
				mft,
				yourEarning,
				cost,
				freightCost,
				handlingFee,
				shippingAddress,
				addressType,
				phone,
				companyPhone,
				email,


				status: status,
				// poNumber: po,
				paymentTerm: payment,

				payment,
				processedAccount: processedAccount,
				invoiceNo: invoiceNo,
				billNo: billNo,

				trackingNo: trackingNo,
				invoiceDate: invoiceDate,
				billDate: billDate,
				shippingDiscount,
				insurance: insurance,
				saleTax: salesTax,
				creditMemo: creditMemo,
				miscFee: miscFee,
				resoldRevenue: resoldRevenue,
				verificationStatus: verification,
				poSixSeries: sixSeries,
				orderDateAccount: orderDateAccount
			},
			{
				where: {
					id: id // Replace someValue with the value you're looking for
				},
				returning: true,
			}
		);

		res.redirect("/amazon/?message=Order Updated Successfully'")
		// The rupdate was successful (updated 1 record)


	} catch (error) {
		console.error(error);
		let message = error.message+':'+" Not Updated Please Enter The Valid Data";
		res.redirect(`/amazon/amazonEdit/${oId}?message=${encodeURIComponent(message)}`);
	}

};










exports.duplicateOrder = async (req, res) => {
	let id = req.params.id
	const order = await Orders.findOne({
		where: { id: id }
	});
	const user = req.session.user
	if (order) {
		// The order with id 1 was found
		let orderid = order.orderId + "-D"

		res.render("amazon/orderDuplicate", { order, orderid, user, page: "dashboard" })
	} else {
		// No order with id 1 was found
		console.log('Order not found');
		res.render("amazon/orderDuplicate", { order, orderid, user, page: "dashboard" })
	}
}








exports.detailsOrderAccount = async (req, res) => {

	const orderId = req.params.orderId;
	const record = await Orders.findAll({
		where: {
			[Op.and]: [


				{
					id: orderId,
				},
			]
		},

	});
	//console.log(record[0])
	lastRecord = await Orders.findAll({
		where: {
			id: {
				[Op.lt]: orderId,        // Find records with id less than the current orderId
			},

		},
		order: [['id', 'DESC']],      // Sort the results in descending order by id
		limit: 1,                    // Limit the result to 1 record (the most recent previous record)
	});
	res.render("dashboard-one", { record: record.length ? record[0] : {}, lastRecord: lastRecord.length ? lastRecord[0] : {} })
};










exports.updateOrderAccount = async (req, res) => {
	const { orderId, status, po, comments, payment, processedAccount, invoiceNo, billNo, latestNo, sixSeries } = req.body;
	//console.log(invoiceNo)

	try {
		const record = await Orders.findOne({
			where: {
				id: orderId
			}
		});

		if (record) {
			// Update the record with the new data
			record.status = status;
			record.poNumber = po;
			record.accountComments = comments;
			record.paymentTerm = payment;
			record.processedAccount = (processedAccount == 'Other') ? "Other" : processedAccount;
			record.invoiceNo = invoiceNo;
			record.billNo = billNo;
			record.poSixSeries = (processedAccount == 'Other') ? sixSeries : '',
				record.latestNo = latestNo;

			record.completeOrCancelDate = new Date().toISOString();;
			await record.save();
			//console.log("===",)
			res.status(200).json({
				status: true, message: "Order updated successfully", orderId: record.orderId,           // Include the orderId in the response
				accountUserId: record.accountUserId, // Include the accountUserId in the response
				updatedStatus: status
			});
		} else {
			res.status(404).json({ status: false, message: "Order not found" });
		}
	} catch (error) {
		console.error("Error updating order:", error);
		res.status(500).json({ message: "An error occurred while updating the order" });
	}

};

exports.updateStatus = async (req, res) => {
	const value = req.body.value;
	if (value == "completed") {
		const id = req.body.id;
		const completeValue = req.body.value;
		try {
			const record = await Orders.findOne({
				where: {
					id: id
				}
			});

			if (record) {
				// Update the record with the new data
				record.status = completeValue;
				
				await record.save();

				res.status(200).json({
					status: true,
					message: "Updated successfully",
					orderId: id, // Include the orderId in the response
					alertMessage: "Order status has been updated."
				});
			} else {
				res.status(404).json({
					status: false,
					message: "Order not found"
				});
			}
		} catch (error) {
			console.error("Error updating order:", error);
			res.status(500).json({
				message: "An error occurred while updating the order"
			});
		}



	} else {
		const cancelValue = req.body.value;
		const id = req.body.id;
		// const canceltype = req.body.canceltype;
		const rfc = req.body.rfc;
		const commentcancellation = req.body.commentcancellation;
		

		try {
			const record = await Orders.findOne({
				where: {
					id: id
				}
			});

			if (record) {
				// Update the record with the new data
				record.status = cancelValue;
				record.cfc = commentcancellation;
				record.rfc = rfc;
			

				await record.save();

				res.status(200).json({
					status: true,
					message: "Updated successfully",
					orderId: id, // Include the orderId in the response
					alertMessage: "Order status has been updated."
				});
			} else {
				res.status(404).json({
					status: false,
					message: "Order not found"
				});
			}
		} catch (error) {
			console.error("Error updating order:", error);
			res.status(500).json({
				message: "An error occurred while updating the order"
			});
		}
	}

};



exports.rating = async (req, res) => {
	const { orderId, score } = req.body;

	let record = await Orders.findOne({
		where: { id: orderId },
	});


	if (record) {
		if (record.rating == 0) {
			// If the rating is empty or null, set the new score
			record.rating = score;
			// Save the updated record to the database
			await record.save();
			res.json({ status: true });
		} else {
			// Rating already exists, send a response indicating failure
			res.json({ status: false });
		}
	} else {
		// No record found for the given orderId
		res.status(404).json({ status: false, message: 'Order not found' });
	}
}






