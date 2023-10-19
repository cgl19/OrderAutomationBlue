const bcrypt = require("bcryptjs");
const db = require("../models");

const {
	Users,
	Orders,
	Powers,
	UserPowers,

} = db;
const excel = require('exceljs');
const fs = require("fs");
const helpers = require("../helpers/helpers");
const validator = require("validator");
const path = require('path');
const csv = require("fast-csv");
const { traceDeprecation } = require("process");
const { Op, fn, col, literal } = require("sequelize");
const readXlsxFile = require("read-excel-file/node");
var csvWriter = require("csv-write-stream");
const { Console } = require("console");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

exports.root = async (req, res) => {

	let employeesData = []

	let employees = await Users.findAll({
		where: {
			role: 'employee',
		},
		include: [
			{
				model: Powers,
			}

		]
	});

	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set time to the start of the day

	for (let index = 0; index < employees.length; index++) {
		console.log("new", employees[index].id)

		let totalOrders = await Orders.count({
			where: {
				[Op.and]: [
					{
						accountUserId: employees[index].id

					},
					{

						[Op.or]: [
							{
								status: 'completed'
							},
							{
								status: 'cancelled'
							}
						]

					}
				]

			}
		})

		console.log(employees[index].id, totalOrders)

		let totalAmzOrders = await Orders.count({
			where: {
				[Op.and]: [
					{
						[Op.or]: [
							{
								amazonUserId: employees[index].id
							},
						]
					},
				]

			}

		})

		let totalTodayOrders = await Orders.count({
			where: {
				[Op.and]: [
					{
						[Op.or]: [
							{
								accountUserId: employees[index].id
							},

						]


					},

					{


						[Op.or]: [
							{
								status: 'completed'
							},
							{
								status: 'cancelled'
							}
						]


					},
					{
						completeOrCancelDate: {
							[Op.gte]: today // Only consider orders from today onwards
						}
					}
				]
			}

		})

		let totalAmzTodayOrders = await Orders.count({
			where: {
				[Op.and]: [
					{
						[Op.or]: [
							{
								amazonUserId: employees[index].id
							},
						]
					},
					{
						createdAt: {
							[Op.gte]: today,
						}
					}
				]
			}

		})





		const average = await Orders.findOne({
			attributes: [
				[
					literal('AVG(TIMESTAMPDIFF(SECOND, inProgressDate, completeOrCancelDate))'),
					'averageProcessingTimeInSeconds'
				],
			],
			where: {
				accountUserId: employees[index].id,
				status: ['cancelled', 'completed'],
			},
			raw: true,
		});

		console.log(employees[index].Powers[0].name)
		let emp = {
			id: employees[index].id,
			name: employees[index].name,
			powers: employees[index]?.Powers[0]?.name,
			totalOrders: employees[index]?.Powers[0]?.name != "Accounts" ? totalOrders : totalAmzOrders,
			totalTodayOrders: employees[index]?.Powers[0]?.name != "Accounts" ? totalTodayOrders : totalAmzTodayOrders,
			average: average.averageProcessingTimeInSeconds
		}

		employeesData.push(emp)


	}
	console.log(employeesData)

	const todaysOrderCount = await Orders.count({
		where: {
			createdAt: {
				[Op.between]: [today, new Date()],
			},
		},
	});
	console.log(todaysOrderCount)

	async function getAllOrdersCount() {
		try {
			const totalCount = await Orders.count();
			return totalCount;
		} catch (error) {
			console.error('Error fetching total order count:', error);
			throw error;
		}
	}

	// Call the function to get the count of all orders
	getAllOrdersCount()
		.then(totalCount => {
			console.log('Total order count:', totalCount);
		})
		.catch(error => {
			// Handle errors
		});

	async function getThisWeeksOrders() {
		try {
			const currentDate = new Date();

			// Calculate the start of the week (Monday)
			const startOfWeek = new Date(currentDate);
			startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
			startOfWeek.setHours(0, 0, 0, 0);

			// Calculate the end of the week (Sunday)
			const endOfWeek = new Date(currentDate);
			endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay() + 1));
			endOfWeek.setHours(23, 59, 59, 999);

			const ordersThisWeek = await Orders.count({
				where: {
					createdAt: {
						[Op.between]: [startOfWeek, endOfWeek],
					},
				},
			});
			console.log(ordersThisWeek);
			return ordersThisWeek;
		} catch (error) {
			console.error("Error fetching this week's orders:", error);
			throw error;
		}
	}

	// Call the function to get orders created between Monday and Sunday of the current week
	getThisWeeksOrders()
		.then(ordersThisWeek => {
			console.log("Orders created this week:", ordersThisWeek);
		})
		.catch(error => {
			// Handle errors
		});


	res.render("admin/dashboard", {
		employeesData
	});
};

exports.employees = async (req, res) => {
	let employees = await Users.findAll({
		where: {
			role: "employee",
		},
		include: [
			{
				model: Powers,
				through: "UserPowers", // Assuming your through model name is "UserPowers"
				as: "Powers", // Alias for the associated powers
			},
		],

	});

	console.log(employees)
	res.render("admin/viewEmployees", {

		employees: employees,
		error_message: req.flash("error_message") || "",
		success_message: req.flash("success_message") || "",
	});
};

exports.addEmployeesProcess = async (req, res) => {
	if (
		req.body.name === "" ||
		req.body.email === "" ||
		req.body.password === ""
	) {
		req.flash("error_message", "Please fillout the full form.");
		res.redirect(`/admin/employees`);
		return;
	}

	req.body.password = bcrypt.hashSync(req.body.password, 12);

	let users = await Users.findAll({
		where: {
			email: req.body.email,
		},
	});

	console.log(users);

	if (users.length > 0) {
		req.flash("error_message", "User already exist with the entered email.");
		res.redirect(`/admin/employees`);
		return;
	} else {
		console.log(req.body);
		const user = await Users.create({ ...req.body, role: "employee" });
		for (let index = 0; index < req.body.powers.length; index++) {
			await UserPowers.create({
				UserId: Number(user.id),
				PowerId: Number(req.body.powers[index]),
			});
		}
		req.flash("success_message", "Employee added successfully.");
		res.redirect(`/admin/employees`);
		return;
	}
};


exports.editRecord = async (req, res) => {
	const id = req.params.id
	const record = await Orders.findAll({
		where: {
			[Op.and]: [
				{
					id
				},
				// {
				// 	accountUserId:req.session.user.id,
				// }
			]
		},

	});
	//console.log(record[0])
	const user = req.session.user
	res.render("admin/editOrder", { user, record: record.length ? record[0] : {} })
};



/////////////////to update from edit form verification:verification,

exports.adminEditOrder = async (req, res) => {
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
				poNumber: po,
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

		res.redirect("/admin/orders")
		// The rupdate was successful (updated 1 record)


	} catch (error) {
		console.error(error);
		// return res.status(500).json({ status: false, error: "Error updating order" });
		res.render("error_view/editError");
	}

};
















exports.editEmployeesProcess = async (req, res) => {
	if (req.session.user.role == "admin") {
		if (req.body.id) {
			if (req.body.password) {
				req.body.password = bcrypt.hashSync(req.body.password, 12);
				Users.update(
					{
						name: req.body.name,
						email: req.body.email,
						password: req.body.password,
					},
					{ where: { id: req.body.id } }
				)
					.then(() => {
						req.flash(
							"success_message",
							"Employee account edited successfully."
						);
						res.redirect(`/admin/employees`);
						return;
					})
					.catch(() => {
						req.flash("error_message", "An error occured. Please try again.");
						res.redirect(`/admin/employees`);
						return;
					});
			} else {
				Users.update(
					{ name: req.body.name, email: req.body.email },
					{ where: { id: req.body.id } }
				)
					.then(() => {
						req.flash(
							"success_message",
							"Employee account edited successfully."
						);
						res.redirect(`/admin/employees`);
						return;
					})
					.catch(() => {
						req.flash("error_message", "An error occured. Please try again.");
						res.redirect(`/admin/employees`);
						return;
					});
			}
		} else {
			req.flash("error_message", "Employee not found.");
			res.redirect(`/admin/employees`);
			return;
		}
	} else {
		req.flash(
			"error_message",
			"You dont have access to edit employee account."
		);
		res.redirect(`/admin/employees`);
		return;
	}
};

exports.deleteEmployeesProcess = async (req, res) => {
	await Users.destroy({
		where: {
			id: req.params.id,
		},
	});
	req.flash("success_message", "Employee deleted su qccessfully.");
	res.redirect(`/admin/employees`);
	return;
};

exports.assignTaskToEmployeesProcess = async (req, res) => {
	console.log(req.body);
	if (Array.isArray(req.body.select)) {
		for (let index = 0; index < req.body.select.length; index++) {
			await DistiVendorList.update(
				{ assignedTo: req.body.id },
				{
					where: {
						id: req.body.select[index],
					},
				}
			);

			await VendorMappings.update(
				{ assignedTo: req.body.id },
				{
					where: {
						id: req.body.select[index],
					},
				}
			);
		}
	} else {
		await DistiVendorList.update(
			{ assignedTo: req.body.id },
			{
				where: {
					id: req.body.select,
				},
			}
		);
	}

	req.flash("success_message", "Tasks assigned successfully.");
	res.redirect(`/admin/employees`);
	return;
};






exports.employeeDetails = async (req, res) => {
	const userId = req.params.id;
	console.log('ffffffffffffff')
	const employeeData = await Users.findByPk(userId)


	console.log(employeeData)
	res.render("admin/employeeDetails", { employeeData: employeeData });
};










exports.orders = async (req, res) => {
	let pendingOrders = await Orders.findAll({where:{status : 'pending'}, attributes : ['id']})
	pendingOrders = pendingOrders.length

	let completedOrders = await Orders.findAll({where:{status : 'completed'}, attributes : ['id']})
	completedOrders = completedOrders.length

	let cancelledOrders = await Orders.findAll({where:{status : 'cancelled'}, attributes : ['id']})
	cancelledOrders = cancelledOrders.length


	// Get the current date
	const currentDate = new Date();

	// Set the start and end time for the current date
	currentDate.setHours(0, 0, 0, 0); // Start of the day
	const nextDay = new Date(currentDate);
	nextDay.setDate(currentDate.getDate() + 1); // End of the day (start of the next day)

	let todaypendingOrders = await Orders.findAll({where:{status : 'pending',createdAt: {
		[Op.between]: [currentDate, nextDay],
	},}, attributes : ['id']})
	todaypendingOrders = todaypendingOrders.length

		let todaycompletedOrders = await Orders.findAll({where:{status : 'completed',createdAt: {
			[Op.between]: [currentDate, nextDay],
		},}, attributes : ['id']})
		todaycompletedOrders = todaycompletedOrders.length

		let todaycancelledOrders = await Orders.findAll({where:{status : 'cancelled',createdAt: {
			[Op.between]: [currentDate, nextDay],
		},}, attributes : ['id']})
		todaycancelledOrders = todaycancelledOrders.length

	res.render("admin/viewOrders",{pendingOrders,completedOrders,cancelledOrders,todaycancelledOrders, todaycompletedOrders, todaypendingOrders})
};





exports.orderPagination = async (req, res) => {
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
		console.log("ssersch");
		Orders.findAll({
			where: {
				[Op.or]: [
					{ orderId: { [Op.substring]: sSearch } },
					{ poNumber: { [Op.substring]: sSearch } },
					{ email: { [Op.substring]: sSearch } },
					{ createdAt: { [Op.substring]: sSearch } },
					{ status: { [Op.substring]: sSearch } },
					{
						'$amazonUser.name$': { [Op.substring]: sSearch }
					},
					{
					'$accountUser.name$': { [Op.substring]: sSearch }
					}
				],

			}, include: [
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


					dataObj.action = `<div class="d-flex">
					<a class="btn btn-sm btn-dark" href="/admin/orders/${data[i].id}">Details</a>
					<a class="btn btn-sm btn-success mx-1" href="/admin/editOrder/${data[i].id}">Edit</a>
					<a class="btn btn-sm btn-danger" href="/admin/deleteOrder/${data[i].id}">Delete</a>
				</div>`
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
		console.log("!!!ssersch");
		Orders.findAll({
			...query,
			include: [
				{
					model: Users,
					as: 'amazonUser', // Replace with the appropriate association alias
					attributes: ['name']
				},
				{
					model: Users,
					as: 'accountUser', // Replace with the appropriate association alias
					attributes: ['name']
				}
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

					dataObj.action = `<div class="d-flex">
					<a class="btn btn-sm btn-dark" href="/admin/orders/${data[i].id}">Details</a>
					<a class="btn btn-sm btn-success mx-1" href="/admin/editOrder/${data[i].id}">Edit</a>
					<a class="btn btn-sm btn-danger" href="/admin/deleteOrder/${data[i].id}">Delete</a>
				</div>`
					// dataObj.edit = `<a class="btn btn-sm btn-success" href="/admin/editOrder/${data[i].id}">Edit</a>`
					// dataObj.delete = `<a class="btn btn-sm btn-warning" href="/admin/deleteOrder/${data[i].id}">Delete</a>`

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
						else {
						}
					});
			});
	}
};





exports.deleteOrder = async (req, res) => {
	const id = req.params.id;
	try {
		const order = await Orders.findByPk(id);

		if (order) {
			await Orders.destroy({ where: { id: id } });
			console.log(`Order with ID ${id} has been deleted.`);
		} else {
			console.log(`Order with ID ${id} not found.`);
		}

		// Redirect to the admin/orders page
		res.redirect('/admin/orders');
	} catch (error) {
		console.error(`Error while deleting order: ${error}`);
		// Handle the error, you can choose to redirect to an error page or send an error response.
		res.status(500).send('Internal Server Error');
	}
};















exports.ordersDetailAdmin = async (req, res) => {
	const orderId = req.params.id;

	const record = await Orders.findAll({
		where: {
			[Op.and]: [


				{
					id: orderId,
				},
				// {
				// 	accountUserId:req.session.user.id,
				// }
			]
		},

	});
	console.log(record[0])


	res.render("admin/orderDetail", { record: record.length ? record[0] : {} })

};

// Exproting starts here 

exports.exportOrders = async (req, res) => {
	console.log(req.body);
	let { fromDate, toDate, employees, status } = req.body;

	toDate = new Date(new Date(toDate).setHours(23, 59, 59))
	var conditions = {};
	if (employees.includes('all') && status.includes('all')) {
		// If both employees and status are 'all'
		conditions.createdAt = {
			[Op.between]: [fromDate, toDate],
		};
	}
	else if (employees.includes('all') && !status.includes('all')) {
		conditions = {
			createdAt: {
				[Op.between]: [fromDate, toDate],
			},
			[Op.or]: {
				amazonUserId: { [Op.in]: employees },
				accountUserId: { [Op.in]: employees },
			},
			status: {
				[Op.in]: status
			}
		}
	}
	else if (!employees.includes('all') && status.includes('all')) {
		conditions = {
			createdAt: {
				[Op.between]: [fromDate, toDate],
			},
			[Op.or]: {
				amazonUserId: { [Op.in]: employees },
				accountUserId: { [Op.in]: employees },
			},
		}
	}
	else if (!employees.includes('all') && !status.includes('all')) {
		conditions = {
			createdAt: {
				[Op.between]: [fromDate, toDate],
			},
			[Op.or]: {
				amazonUserId: { [Op.in]: employees },
				accountUserId: { [Op.in]: employees },
			},
			status: {
				[Op.in]: status
			}
		}
	}
	try {

		console.log(conditions)
		if (conditions) {


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
				where: conditions,
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

				console.log("++++", order)
				const rows = [];
				const skus = order.sku.split('|');
				console.log("===========================", skus)

				for (let index = 0; index < skus.length; index++) {
					let row = '';
					for (const key in order) {
						if (order.hasOwnProperty(key) && key !== 'id') {
							if (key === "sku") {
								console.log("there every where")
								row += skus[index] + "#&a";
							}

							else if (key === "accountUser") {
								console.log("hereeee")
								row += order?.accountUser?.dataValues?.name + "#&a";
							}
							else if (key === "amazonUser") {
								console.log("hereeee")
								row += order?.amazonUser?.dataValues?.name + "#&a";
							}
							else if (key === "quantity") {

								row += order.quantity.split('|')[index] + "#&a";
							}
							else if (key === "price") {
								row += order.price.split('|')[index] + "#&a";
							}
							else if (key === "cost") {
								console.log("shapaatar gang")
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
				//   console.log(headers)
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
			const filePath = path.join(__dirname, '../export/admin', 'file.xlsx');
			//fs.writeFileSync(filePath,'')
			for (let index = 0; index < exportOrders.length; index++) {
				const order = exportOrders[index];
				const dataValues = order.dataValues;

				let concatenatedString = ''; // Reset for each order
				let rows; // Reset for each order

				rows = await generateRowsForOneOrder(dataValues);
				console.log(rows, 'data rows');

				for (let index = 0; index < rows.length; index++) {
					const splitArray = rows[index].split('#&a');
					// splitArray.shift();

					worksheet.addRow(splitArray);
				}
			}


			workbook.xlsx.writeFile(filePath)
				.then(() => {
					console.log('Excel file created successfully.');
				})
				.catch((error) => {
					console.error('Error creating Excel file:', error);
				});


		}

	}


	// Calculate process time for each order and modify the exportOrders
	// 	  const modifiedOrders = exportOrders.map(order => {
	// 		const modifiedOrder = { ...order.dataValues };

	// 		if (modifiedOrder.accountUser) {
	// 		  modifiedOrder.accountUser = modifiedOrder.accountUser.dataValues.name;
	// 		}

	// 		if (modifiedOrder.amazonUser) { 
	// 		  modifiedOrder.amazonUser = modifiedOrder.amazonUser.dataValues.name;
	// 		}

	// 		if (modifiedOrder.inProgressDate && modifiedOrder.completeOrCancelDate) {
	// 		  const processTime = modifiedOrder.completeOrCancelDate - modifiedOrder.inProgressDate;
	// 		  modifiedOrder.processTimeInMinutes = processTime / (1000 * 60); // Calculate process time in minutes
	// 		}

	// 		return modifiedOrder;
	// 	  });

	// 	  // Define the export directory
	// 	  const exportDir = path.join(__dirname, '..', 'export');
	// 	  if (!fs.existsSync(exportDir)) {
	// 		fs.mkdirSync(exportDir);
	// 	  }

	// 	  // Define the CSV file path
	// 	  const csvFilePath = path.join(exportDir, `orders_${Date.now()}.csv`);

	// 	  // Extract column names from the modifiedOrders object and remove empty keys
	// 	  const columnNames = Object.keys(modifiedOrders[0]).filter(key => key);
	//   console.log(columnNames);
	// 	  // Define the CSV writer with the extracted column names as header
	// 	  const csvWriter = await createObjectCsvWriter({
	// 		path: csvFilePath,
	// 		header: [
	// 		  ...columnNames.filter(key => key !== 'amazonUserId' && key !== 'accountUserId'),
	// 		  { id: 'processTimeInMinutes', title: 'Process Time (minutes)' }, // Add process time header
	// 		],
	// 	  });

	// 	  // Write the header row to the CSV file
	// 	  await csvWriter.writeRecords([{}]);

	// 	  // Write the modified orders with the process times to the CSV file
	// 	  await csvWriter.writeRecords(modifiedOrders);

	// 	  // Set headers for the download response
	// 	  res.setHeader('Content-Disposition', `attachment; filename=${path.basename(csvFilePath)}`);
	// 	  res.setHeader('Content-Type', 'text/csv');

	// 	  // Stream the file to the response
	// 	  const fileStream = fs.createReadStream(csvFilePath);
	// 	  fileStream.pipe(res);

	// 	  // After sending the response, delete the CSV file
	// 	  fileStream.on('end', () => {
	// 		fs.unlink(csvFilePath, err => {
	// 		  if (err) {
	// 			console.error('Error deleting CSV file:', err);
	// 		  }
	// 		});
	// 	  });

	catch (error) {
		console.error('Error exporting orders:', error);
		res.status(500).send('An error occurred while exporting orders.');
	}
};



// downloading the csv after creating the csv 
//on the same ajax call which is exporting the record  on client side  another function runs

exports.downloadCsv = (req, res) => {
	const filePath = path.join(__dirname, '../export/admin', 'file.xlsx'); // Assuming file.csv is in the root directory
	console.log('Downloading the File');
	res.download(filePath, 'file.xlsx', (err) => {
		if (err) {
			res.status(500).send('Error downloading the file.');
		}
	});
};









exports.newFilter = async (req, res) => {

	// let { fromDate, toDate, employees, status,mfr,sku,disti } = req.body;
	try {
		console.log(req.body);
		let { fromDate, toDate, employeesfilter, statusfilter, sku, mfr, disti } = req.body;

		toDate = new Date(new Date(toDate).setHours(23, 59, 59))
		var conditions = {
			createdAt: {
				[Op.between]: [fromDate, toDate],
			}
		};




		if (statusfilter) {
			conditions = {
				...conditions, status: {
					[Op.in]: statusfilter,
				}
			}
		}
		if (employeesfilter) {
			conditions = {
				...conditions, [Op.or]: {
					amazonUserId: { [Op.in]: employeesfilter },
					accountUserId: { [Op.in]: employeesfilter },
				}
			}
		}
		if (sku) {
			conditions = {
				...conditions, sku: {
					[Op.substring]: sku
				}
			}
		}
		if (mfr) {
			conditions = {
				...conditions, mfrName: {
					[Op.substring]: mfr
				}
			}
		}
		if (disti) {
			if (disti.length > 0) {
				conditions.distributor = {
					[Op.in]: disti
				}
			}

		}
		console.log(conditions)

		if (conditions) {


			const orders = await Orders.findAll({
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

					// ... Include other attributes you need
				],
				where: conditions,
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





			console.log(orders, '====================================================================================')
			const orders1 = await Orders.findAll({ where: { ...conditions } });
			const allSkus = orders1.flatMap((order) => order?.sku?.split('|'));
			const allMfr = orders1.flatMap((order) => order?.mfrName?.split('|'));
			const allDisti = orders1.flatMap((order) => order?.distributor?.split('|'));

			// Group the SKUs and count the number of orders for each SKU
			const skuCounts = {};
			allSkus.forEach((sku) => {
				const skuKey = sku.toUpperCase(); // Convert to uppercase
				if (skuCounts[skuKey]) {
					skuCounts[skuKey]++;
				} else {
					skuCounts[skuKey] = 1;
				}
			});

			// Convert the counts into an array of objects
			const skuCountArray = Object.entries(skuCounts).map(([sku, count]) => ({ sku, count }));

			// Sort the results in descending order based on the number of orders
			skuCountArray.sort((a, b) => b.count - a.count);
			const top10Sku = skuCountArray
			// Print the sorted results
			top10Sku.forEach((skuCount) => {
				console.log(`SKU: ${skuCount.sku}, Number of Orders: ${skuCount.count}`);
			});


			const mfrCounts = {};
			orders1.forEach((order) => {
				const mfrName = order.mfrName.toUpperCase(); // Convert to uppercase
				// Convert to uppercase
				if (mfrCounts[mfrName]) {
					mfrCounts[mfrName]++;
				} else {
					mfrCounts[mfrName] = 1;
				}
			});

			// Convert the counts into an array of objects
			const mfrCountArray = Object.entries(mfrCounts).map(([mfrName, count]) => ({
				mfrName,
				count,
			}));

			// Sort the results in descending order based on the number of orders
			mfrCountArray.sort((a, b) => b.count - a.count);
			const top10Manufacturers = mfrCountArray
			let choiceCount;
			let techCount;
			// Print the sorted results
			top10Manufacturers.forEach((mfrCount) => {
				console.log(`Manufacturer: ${mfrCount.mfrName}, Number of Orders: ${mfrCount.count}`);

			});
			const distiCounts = {};
			allDisti.forEach((distributor) => {
				if (distiCounts[distributor]) {
					distiCounts[distributor]++;
				} else {
					distiCounts[distributor] = 1;
				}
			});

			// Convert the counts into an array of objects
			const distributorCountArray = Object.entries(distiCounts).map(([distributor, count]) => ({ distributor, count }));

			// Sort the results in descending order based on the number of orders
			distributorCountArray.sort((a, b) => b.count - a.count);
			const top10disti = distributorCountArray

			// Print the sorted results
			// top10disti.forEach((distiCount) => {
			// 	if (distiCount.distributor.includes("Choice")) {
			// 	  choiceCount = distiCount.count + choiceCount;
			// 	} else if (distiCount.distributor.includes("Tech")) {
			// 	  techCount = distiCount.count + techCount;;
			// 	}
			//   });














































































			let employeesData = []

			let employees = await Users.findAll({
				where: {
					role: 'employee',
				},
				include: [
					{
						model: Powers,
					}

				]
			});

			const today = new Date();
			today.setHours(0, 0, 0, 0); // Set time to the start of the day

			for (let index = 0; index < employees.length; index++) {
				console.log("new", employees[index].id)

				let totalOrders = await Orders.count({
					where: {
						[Op.and]: [
							{
								accountUserId: employees[index].id

							},
							{

								[Op.or]: [
									{
										status: 'completed'
									},
									{
										status: 'cancelled'
									}
								]

							}
						]

					}
				})

				console.log(employees[index].id, totalOrders)

				let totalAmzOrders = await Orders.count({
					where: {
						[Op.and]: [
							{
								[Op.or]: [
									{
										amazonUserId: employees[index].id
									},
								]
							},
						]

					}

				})

				let totalTodayOrders = await Orders.count({
					where: {
						[Op.and]: [
							{
								[Op.or]: [
									{
										accountUserId: employees[index].id
									},

								]


							},

							{


								[Op.or]: [
									{
										status: 'completed'
									},
									{
										status: 'cancelled'
									}
								]


							},
							{
								completeOrCancelDate: {
									[Op.gte]: today // Only consider orders from today onwards
								}
							}
						]
					}

				})

				let totalAmzTodayOrders = await Orders.count({
					where: {
						[Op.and]: [
							{
								[Op.or]: [
									{
										amazonUserId: employees[index].id
									},
								]
							},
							{
								createdAt: {
									[Op.gte]: today,
								}
							}
						]
					}

				})





				const average = await Orders.findOne({
					attributes: [
						[
							literal('AVG(TIMESTAMPDIFF(SECOND, inProgressDate, completeOrCancelDate))'),
							'averageProcessingTimeInSeconds'
						],
					],
					where: {
						accountUserId: employees[index].id,
						status: ['cancelled', 'completed'],
					},
					raw: true,
				});

				console.log(employees[index].Powers[0].name)
				let emp = {
					id: employees[index].id,
					name: employees[index].name,
					powers: employees[index]?.Powers[0]?.name,
					totalOrders: employees[index]?.Powers[0]?.name != "Accounts" ? totalOrders : totalAmzOrders,
					totalTodayOrders: employees[index]?.Powers[0]?.name != "Accounts" ? totalTodayOrders : totalAmzTodayOrders,
					average: average.averageProcessingTimeInSeconds
				}

				employeesData.push(emp)


			}
			console.log(employeesData)

			const todaysOrderCount = await Orders.count({
				where: {
					createdAt: {
						[Op.between]: [today, new Date()],
					},
				},
			});
			console.log(todaysOrderCount)

			async function getAllOrdersCount() {
				try {
					const totalCount = await Orders.count();
					return totalCount;
				} catch (error) {
					console.error('Error fetching total order count:', error);
					throw error;
				}
			}

			// Call the function to get the count of all orders
			getAllOrdersCount()
				.then(totalCount => {
					console.log('Total order count:', totalCount);
				})
				.catch(error => {
					// Handle errors
				});

			async function getThisWeeksOrders() {
				try {
					const currentDate = new Date();

					// Calculate the start of the week (Monday)
					const startOfWeek = new Date(currentDate);
					startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
					startOfWeek.setHours(0, 0, 0, 0);

					// Calculate the end of the week (Sunday)
					const endOfWeek = new Date(currentDate);
					endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay() + 1));
					endOfWeek.setHours(23, 59, 59, 999);

					const ordersThisWeek = await Orders.count({
						where: {
							createdAt: {
								[Op.between]: [startOfWeek, endOfWeek],
							},
						},
					});
					console.log(ordersThisWeek);
					return ordersThisWeek;
				} catch (error) {
					console.error("Error fetching this week's orders:", error);
					throw error;
				}
			}

			// Call the function to get orders created between Monday and Sunday of the current week
			getThisWeeksOrders()
				.then(ordersThisWeek => {
					console.log("Orders created this week:", ordersThisWeek);
				})
				.catch(error => {
					// Handle errors
				});














			console.log("_______________________________________________", employeesData)
			console.log("_______________________________________________++++++++++++++++++", orders)
			res.render('admin/orderfilter', { employeesData, orders, top10Sku, top10Manufacturers, top10disti, toDate, fromDate, mfr, disti })
		} else {
			res.render('admin/orderfilter', { orders: [] })
		}

	} catch (error) {
		console.log(error)
		res.render('admin/orderfilter', { orders: [], error })
	}
}

