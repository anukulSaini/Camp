

   var express = require("express"),
router      = express.Router({mergeParams:true}),
Comment        = require("../models/comment"),
Campground  = require("../models/campground")



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


router.post("/", isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
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
router.get("/:id/edit",checkOwnerShip,function(req,res){    				              Campground.findById(req.params.id,function(err,foundcampground){
 res.render("edit",{campground:foundcampground}); 
});
});
	
//update route
router.put("/:id",checkOwnerShip,function(req,res){
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



