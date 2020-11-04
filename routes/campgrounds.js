var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX -show all the campgrounds
router.get("/campgrounds", function(req,res)
{	
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds)
	{
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("campgrounds/index", {campgrounds : allCampgrounds});
			}
		
	});
});

//CREATE -add new campgroud to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req,res)
{
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author={
		id : req.user._id,
		username : req.user.username
	};
	var newCampground = {name:name, image:image, description:description, author:author, price : price};
	Campground.create(newCampground, function(err, newlyCreated)
	{
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("campgrounds");
			}
	});
	
});

//NEW -shows the form to create a new campground
router.get("/campgrounds/new", function(req,res)
{
	res.render("campgrounds/new");
});

//SHOW - shows more info about a campground
//pay attention this must be last cause this ---> :id is general
router.get("/campgrounds/:id", function(req,res)
{
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("campgrounds/show", {campground: foundCampground});	
     	}
		
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit/",middleware.checkCampgroundOwnership, function(req,res)
{
	Campground.findById(req.params.id, function(err, foundCampground)
	{
		res.render("campgrounds/edit", {campground:foundCampground});
	});
	
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id/",middleware.checkCampgroundOwnership, function(req,res)
{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground)
	{
		if(err)
			{
				redirect("/campgrounds");
			}
		else
			{
				res.redirect("/campgrounds/" +updatedCampground._id);
			}
		
	});
});

//DESTROY CAMPGROIND ROUTE
router.delete("/campgrounds/:id/",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err)
{
		if(err)
			{
				res.redirect("/campgrounds");
			}
		else
			{
				res.redirect("/campgrounds");
			}
});
});

module.exports = router;