var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//ROOT route
router.get("/", function(req,res)
{
	res.render("landing");
	
});

//====================
//AUTHANTICATION ROUTS
//====================

//SHOW REGISTER FORM
router.get("/register", function(req,res){
	res.render("register");
});

//SIGN UP LOGIC
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err)
			{
				req.flash("error", err.message);
				return res.render("register");
			}
		passport.authenticate("local")(req,res,function()
		{
			req.flash("success", "Welcome to YelpCamp" + user.username);
			res.redirect("/campgrounds");
		});
		
	});
});

//SHOW LOGIN FORM
router.get("/login", function(req,res){
	res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
	{
	 successRedirect : "/campgrounds",
	 failureRedirect : "/login"
    }) ,function(req,res)
	{

	});

//LOGOUT
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "logged you out");
	res.redirect("/campgrounds");
});

module.exports = router;
