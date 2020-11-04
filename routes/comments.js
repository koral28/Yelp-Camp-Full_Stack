var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

//when user make a get req to the page with the form it will run the is loggedin first-check if the user login or not-if not he could not make a comment
//COMMENTS NEW ROUTE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res)
{
	Campground.findById(req.params.id, function(err, campground)
	{
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("comments/new", {campground : campground});
				
			}
	});
});

//COMMENTS CREATE ROUTE
router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req,res)
{
	Campground.findById(req.params.id, function(err,campground)
	{
		if(err)
			{
				console.log(err);
				res.redirect("/campgrounds");
			}
		else
			{
				Comment.create(req.body.comment, function(err, comment)
				{
				if(err)
					{
						req.flash("error", "Something went wrong");
						console.log(err);
					}
				else
					{
						//conact the username that login into the author username (now we dont need te input form of author (cause all comments are only for users which sign in)
						//add username and id to comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						//save comment
						comment.save();
						campground.comments.push(comment);
						campground.save();
						req.flash("success", "Successfully added comment");
						res.redirect("/campgrounds/" + campground._id);
					}
				});
			}
	});
	
	
});

//COMMENTS EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req,res)
{
	Comment.findById(req.params.comment_id, function(err, foundComment)
	{
		if(err)
			{
				res.redirect("back");
			}
		else
			{
				//the req.params.id refer to the id in the route after campgrounds- the campground id 
				//i need only the campground id for the edit so i pass only this
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
	});
});

//COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res)
{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err)
			{
				res.redirect("back");
			}
		else
			{
				//back to show  page
				res.redirect("/campgrounds/" +req.params.id);
			}
	});
	
});

//DESTROY COMMENT ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err)
	{
			if(err)
				{
					res.redirect("back");
				}
			else
				{
					req.flash("success", "Comment deleted");
					//back to show  page
					res.redirect("/campgrounds/" +req.params.id);
				}
	});

});

module.exports = router;