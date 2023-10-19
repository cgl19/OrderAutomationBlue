const bcrypt = require("bcryptjs");
const db = require("../models");
const { Users, Powers } = db;
const helpers = require("../helpers/helpers");
const validator = require("validator");

exports.root = (req, res) => {
	res.redirect("/auth/signin");
};

exports.signIn = (req, res) => {
	res.render("auth/signin");
};

exports.signInProcess = async (req, res) => {
	if (req.body.email === "" || req.body.password === "") {
		res.render("auth/signin", {
			error: true,
			message: "Please fill out the complete form.",
		});
		return;
	}

	if (!validator.isEmail(req.body.email)) {
		res.render("auth/signin", {
			error: true,
			message: "The given email is incorrect.",
		});
		return;
	}

	helpers.sanitizeData(req.body);

	req.body.email = validator.normalizeEmail(req.body.email);

	let users = await Users.findAll({
		where: {
			email: req.body.email,
			status: "active",
		},
		include: Powers,
	});
	if (users) {
		let user = users[0];

		if (user?.password) {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				if (user.status != "active") {
					res.render("auth/signin", {
						error: true,
						message: "Your account is not active. Please contact support.",
					});
				} else {
					powers = [];
					for (let index = 0; index < user.Powers.length; index++) {
						powers.push(user.Powers[index].name);
					}
					console.log(powers);
					delete user.password;
					req.session.user = user;
					req.session.powers = powers;
					if (user.role == "admin") {
						res.redirect("/admin/");
					} else if (user.role == "employee") {
						if (powers == "amazon" || powers == "AmazonWithReporting") {
							res.redirect("/amazon/")
						} else if (powers == "account" || powers == "AccountWithReporting") {
							res.redirect("/account/account");
						} else {
							res.redirect("/account/account")
						}


					} else {
						res.render("auth/signin", {
							error: true,
							message: "Incorrect Credentials.",
						});
					}
				}
			} else {
				res.render("auth/signin", {
					error: true,
					message: "Incorrect Credentials.",
				});
			}
		} else {
			res.render("auth/signin", {
				error: true,
				message: "You have to signup first.",
			});
		}
	} else {
		res.render("auth/signin", { error: true, message: "Incorrect Credentials." });
	}
};

exports.logout = async (req, res) => {
	if (req.session.destroy()) {
		res.redirect("/auth/signin");
	}
};

exports.forgetPass = (req, res) => {
	res.render("forgetPass");
};

exports.forgetPassProcess = async (req, res) => {
	if (req.body.email == "") {
		res.render("forgetPass", {
			error: true,
			message: "Please enter your email.",
		});
		return;
	}

	if (!validator.isEmail(req.body.email)) {
		res.render("forgetPass", {
			error: true,
			message: "The given email is incorrect.",
		});
		return;
	}

	helpers.sanitizeData(req.body);

	var result = [];
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < 10; i++) {
		result.push(
			characters.charAt(Math.floor(Math.random() * charactersLength))
		);
	}
	pass = result.join("");
	password = await bcrypt.hashSync(pass, 10);
	let html = `
                <h1>SMART HR</h1>
                <h5>Your password has been changed.</h5>
                <p>Use the follwing password for your next login.</p><br>
                <p>Password: ${pass}</p><br>
                <p>And make sure to change it as soon as possible.</p>
            `;

	Users.updateOne({ email: req.body.email }, { password })
		.then(() => {
			helpers.mail(
				req.body.email,
				"Your SMART HRM password has been changed.",
				html
			);
			res.render("forgetPass", {
				error: false,
				message:
					"An email with password reset instructions has been sent to you.",
			});
			return;
		})
		.catch(() => {
			res.render("forgetPass", {
				error: true,
				message: "An error occured. Please try again.",
			});
			return;
		});
};

exports.profile = async (req, res) => {
	let role = req.originalUrl.split("/")[1];
	const user=await req.session.user;

	res.render("profile", {
		role,user,
		error_message: req.flash("error_message") || "",
		success_message: req.flash("success_message") || "",
	});
};

exports.profileProcess = (req, res) => {
	let role = req.originalUrl.split("/")[1];
	if (req.body.password) {
		req.body.password = bcrypt.hashSync(req.body.password, 12);
		Users.update(
			{ ...req.body, password: req.body.password },
			{ where: { id: req.session.user.id } }
		)
			.then(() => {
				req.flash("success_message", "Password updated successfully.");
				res.redirect(`/${role}/profile`);
				return;
			})
			.catch(() => {
				req.flash("error_message", "An error occured. Please try again.");
				res.redirect(`/${role}/profile`);
				return;
			});
	} else {
		req.flash("error_message", "Please enter password to change it.");
		res.redirect(`/${role}/profile`);
		return;
	}
};
