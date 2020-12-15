var express           = require("express"),
router                = express.Router(),
User                  = require("../models/user"),
passport              = require("passport"),
localStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose")
	

router.get("/",function(req,res){
	res.render("landing");
});
router.get("/register",function(req,res){
	res.render("register");
});
router.post("/register",function(req,res){
	req.body.username
	req.body.password
	var newUser=new User({username:req.body.username})
	User.register(newUser, req.body.password,function(err,user){
		if (err){
			req.flash("error",err.message);
			return res.render("register");
		}
		{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to Yelpcamp " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});
router.get("/login",function(req,res){
	res.render("login");
});
//using middleware in next route
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
});
router.get("/logout",function(req,res,user){
	req.logout();
	req.flash("success","Successfully loged you out " + user.username);             res.redirect("/campgrounds");
	console.log('logout sucess')
	
	
});
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","please log in first!!")
	res.redirect("/login");
}

module.exports = router;
