
var express  = require("express"),
router       = express.Router(),
Campground   = require("../models/campground")


router.get("/",function(req,res){
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err)
		}
		else{
		res.render("campgrounds",{campgrounds1:allcampgrounds});
          }
	});
});

router.get("/new",isLoggedIn,function(req,res){
    res.render("new");
});
router.post("/",isLoggedIn,function(req,res){
	
	
  //add author to campground
  // req.body.campground.author = {
  //   id: req.user._id,
  //   username: req.user.username
  // }
  Campground.create(req.body.campground, function(err, campground) {
    if (err) {
      // req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/campgrounds/' + campground.id);
  });
});
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,newcc){
		if(err){
			console.log(err);
		      }
		else{
			console.log(newcc)
			res.render("show", {camp : newcc });
		    }
	});
});
//edit router
router.get("/:id/edit",function(req,res){    				              Campground.findById(req.params.id,function(err,foundcampground){
 res.render("edit",{campground:foundcampground}); 
});
});
	
//update route
router.put("/:id",function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body,function(err,update){
		if(err){
			res.redirect("/campgrounds/" + req.params.id);
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//Delete router
router.delete("/:id",checkOwnerShip,function(req,res){
		Campground.findByIdAndRemove(req.params.id,function(err){
			if(err){
				res.redirect("/campgrounds");
			}else{
				// req.flash("success","Successfully Deleted");
				res.redirect("/campgrounds");
			}
	});
	});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	// req.flash("error","You need to be loged in to do that");
	res.redirect("/login");
}

function checkOwnerShip(req,res,next){
	if(req.isAuthenticated()){
				 Campground.findById(req.params.id,function(err,foundcampground){
					if(err){
						// req.flash("error","campground not found");
					   res.redirect("back");
						  }
					 else{
					   //does user own campgrounds
							  if(foundcampground.author.id.equals(req.user._id)){
							   next();
								  }
							 else{
								 // req.flash("error","You do not have permission to do that");
								  res.redirect("back");
								  }
						  }	
				 });
			 }
			else{
				// req.flash("error","You need to be loged in to do that");
				res.redirect("back");
				}
}

module.exports = router;


