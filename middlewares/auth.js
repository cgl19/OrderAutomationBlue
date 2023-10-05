const Users = require("../models/Users");

exports.redirectFromSigninSignupPages = (req, res, next) => {
	if (req.session?.user) {
		if (req.session.user.role == "admin") res.redirect("/admin");
		if (req.session.user.role == "employee") res.redirect("/employee");
	} else {
		next();
	}
};

exports.redirectToSigninIfNotAuthenticated = async (req, res, next) => {
	if (req.session.user) {
		console.log("1");
		if (req.session.user.role == "admin") {
			console.log("2");
			if (req.baseUrl == "/admin") {
				console.log("3");
				let user = req.session.user;
				let powers = req.session.powers;
				res.locals.user = user;
				res.locals.powers = powers;
				next();
			} else {
				console.log("4");
				res.redirect("/auth/signin");
			}
		} 
		else if (req.session.user.role == "employee" && req.session.powers=='accounts')  { 
			console.log("4");
			if (req.baseUrl == "/employee") {
				let user = req.session.user;
				let powers = req.session.powers;
				res.locals.user = user;
				res.locals.powers = powers;
				
				next();
			} else {
				res.redirect("/auth/signin");
			}
		}
		else if (req.session.user.role == "employee" && req.session.powers=='amazon')  { 
			console.log("5");
			if (req.baseUrl == "/amazon") {
				let user = req.session.user;
				let powers = req.session.powers;
				res.locals.user = user;
				res.locals.powers = powers;
				
				next();
			} else {
				res.redirect("/auth/signin");
			}
		}
	} 
	else {
		console.log("6");
		res.redirect("/auth/signin");
	}
};


