
const bcrypt = require("bcryptjs");
const db = require("../models");
const helpers = require("../helpers/helpers");
const validator = require("validator");
const e = require("connect-flash");
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const path = require('path');
const { json } = require("body-parser");
const { Orders,Users,Powers,UserPowers } = db;
const { Op, where } = require("sequelize");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const express = require('express');
const readXlsxFile = require("read-excel-file/node");
const excel = require('exceljs');
const { log } = require("console");



exports.profile= async(req,res)=>{
    res.render("amazonView");
}




// this route is responsible to redirect to amazon dashboard view
exports.root = async (req, res) => {
	//console.log(req.session.user)
// 	const searchName = 'accounts'; // The value you want to search for

// const foundPower = req.session.user.Powers.find(power => power.name === searchName);
// 	if (foundPower){
// 		res.redirect("/employee/account")
// 	}


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

		let userid=req.session.user.id;
		let user=await Users.findByPk(userid,{
			include: [
				{
				  model: Powers,
				  through: UserPowers,
				  as: 'Powers', // Assuming your association is named "Powers"
				},
			  ],
		  });



		  const userPowers = user.Powers; // This will be an array of powers
		  console.log("-----------------",userPowers)
  // You can further work with the userPowers array as needed
  //console.log("vvv",userId);
		 
		const assignedCount = assigned.length;
		const completedOrderCount= completedOrders.length;
		//console.log(employeesData)
		
	
		res.render("amazon/dashboard", {pendingAndCompleted, pendingOrder, assignedCount,completedOrderCount, employeesData,userPowers,user });
	  } catch (error) {
		console.error("Error:", error);
		res.status(500).send("An error occurred");
	  }
};






//this routes is used to return the view to amazon user to add Order
exports.ordersAdd= async(req,res)=>{
	let order
	let orderid
   res.render("amazon/addOrder",{order,orderid});
};



exports.orderPaginate = async (req, res) => {
	const { iDisplayLength, sEcho, sSearch, iDisplayStart } = JSON.parse(
		JSON.stringify(req.body)
	);console.log(" ssersch ");
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
			include : [
				{
					model: Users,
					as: 'amazonUser', // Replace with the appropriate association alias
					attributes: ['name']
				},{
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
					dataObj.details = `<a class="btn btn-primary" href="/employee/detailsOrderAccount/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a> `
					
					
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
		user=req.session.user.id
		Orders.findAll({...query,
			where: {
				status: {
					[Op.in]: ['completed', 'on-hold','cancelled'],
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

			
				dataObj.details = `<a class="btn btn-primary" href="/employee/detailsOrderAccount/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a> `
				
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
			include : [
				{
					model: Users,
					as: 'amazonUser', // Replace with the appropriate association alias
					attributes: ['name']
				},{
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
					dataObj.rating = data[i].rating ? data[i].rating : ""

					
					if(data[i].status== "completed"){dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/duplicateOrder/${data[i].id}">Duplicate</a>`}else{
					dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a> <a class="btn btn-primary" href="/employee/duplicateOrder/${data[i].id}">Duplicate</a>`
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
		Orders.findAll({...query,
			include: [
				{
					model: Users,
					as: 'amazonUser', // Replace with the appropriate association alias
					attributes: ['name']
				},{
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

				dataObj.createdAt = data[i].createdAt ? data[i].createdAt : ""

				dataObj.rating = data[i].rating ? `<div class='ratingDiv' data-score='${data[i].rating}' data-orderid='${data[i].id}'></div>` : `<div class='ratingDiv' data-score='0' data-orderid='${data[i].id}'></div>`

			
					if(data[i].status== "completed"){dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/duplicateOrder/${data[i].id}">Duplicate</a>`}else{
					dataObj.details = `<a class="btn btn-primary" href="/employee/amazonOrderDetail/${data[i].id}">Details</a><a class="btn btn-primary" href="/employee/editOrderAccount/${data[i].id}">Edit</a><a class="btn btn-primary" href="/employee/duplicateOrder/${data[i].id}">Duplicate</a> `
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




