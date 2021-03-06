 var express                   = require("express"),
	 methodOverride        =require("method-override"),
         mongoose              = require("mongoose"),
	 bodyParser            = require("body-parser"),
	 flash                 = require("connect-flash"),
         app                   = express(),
	 Comment               = require("./models/comment"),   
	 Campground            = require("./models/campground"),
	 passport              = require("passport"),
	 localStrategy         = require("passport-local"),
	 passportLocalMongoose = require("passport-local-mongoose"),
	 User                  = require("./models/user")

var indexRoutes      =require("./routes/authentication"),   
    commentRoutes    =require("./routes/comments"),
    campgroundRoutes =require("./routes/campgrounds")




mongoose.connect("mongodb://localhost:27017/Camping",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret:"anukul saini",
	resave:false,
	saveUninitialized:false
}));

app.locals.moment = require('moment');


//PASSPORT CONFIGURATIONS




app.use(passport.initialize());
app.use(passport.session());

// responsible for decoding and incoding data ..in the user module we have added passport-local-mongoose due tow hich these two works
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});



app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3000,function(){
	console.log('SERVER LISTENING');
});
