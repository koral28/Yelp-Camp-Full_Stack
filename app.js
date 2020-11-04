var express        =  require("express"),
    app            =  express(),
    bodyParser     =  require("body-parser"),
    mongoose  	   =  require("mongoose"),
	flash          =  require("connect-flash"),
    passport       =  require("passport"),
    LocalStrategy  =  require("passport-local"),
	methodOverride =  require("method-override"),
    Campground     =  require("./models/campground"),
    Comment        =  require("./models/comment"),
    User           =  require("./models/user"),
    seedDB         =  require("./seeds");

//requring routes
var commentsRoutes    = require("./routes/comments");
	campgroundsRoutes = require("./routes/campgrounds");
	indexRoutes       = require("./routes/index");

// APP CONFIG
//this one avoid warning cause this new version
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://dbuser:dbuserpassword@cluster0-braun.mongodb.net/test?retryWrites=true&w=majority', 
{
	useNewUrlParser: true,
	useCreateIndex: true
	
}).then(() =>{
	console.log('Connected to DB!');
	
}).catch(err =>{
	console.log('ERROR:', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//in Node.js, __dirname is always the directory in which the currently executing script resides
app.use(express.static(__dirname + "/public"));
//seed the db
seedDB();
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "I will be the best developer ever!!!!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//this one will be in every rout instead do manualy in every route this- currentUser : req.user to pass it throw
//req.user can be empty if no one as signed in or contain username and id 
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//EXPRESS ROUTE
//tell the app to use this routes we reqiured
//we can put here also the common of the campground routs which all start with "/camground"- clean the code
app.use(commentsRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);

app.listen(3000,() =>
{
	console.log("server is listening on port 3000");
	
});