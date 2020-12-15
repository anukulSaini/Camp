  var express = require("express"),
router      = express.Router({mergeParams:true}),
Comment        = require("../models/comment"),
Campground  = require("../models/campground")

router.get("/new",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){}else{
			res.render("newCom",{campground:campground});}
	})
});
router.post("/",isLoggedIn,function(req,res){
		Campground.findById(req.params.id,function(err,campground){
			if(err){
				res.redirect("/")
			}
			else{
			Comment.create(req.body.comment,function(err,comment){
					if(err){
						req.flash("erroe","Something went wrong");
					}
					else{
						//add coment and id to username
						comment.author.id=req.user._id;
						comment.author.username= req.user.username;
						//save comment
						comment.save();
						campground.comments.push(comment);
				        campground.save();
						req.flash("success","successfully added comment")
				        res.redirect('/campgrounds/' + campground._id);
					}
			});
			}
			
		 })
});
router.get("/:comment_id/edit",checkCommentOwnerShip,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundcomment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("commentEdit",{campground_id:req.params.id , comment:foundcomment});
		}
	});
});
router.put("/:comment_id",checkCommentOwnerShip,function(req,res){
Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatecomment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
router.delete("/:comment_id",checkCommentOwnerShip,function(req,res){
		Comment.findByIdAndRemove(req.params.comment_id,function(err){
			if(err){
				res.redirect("back");
			}else{
				res.redirect("/campgrounds/" + req.params.id);
			}
	});
});
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		
		return next();
	}
	req.flash("error","please log in first!!")
	res.redirect("/login");
}
function checkCommentOwnerShip(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundcomment){
					if(err){
					   res.redirect("back");
						  }
					 else{
					   //does user own campgrounds
							  if(foundcomment.author.id.equals(req.user._id)){
							   next();
								  }
							 else{
								  res.redirect("back");
								  }
						  }	
				 });
			 }
			else{
				res.redirect("back");
				}
}
module.exports = router;
