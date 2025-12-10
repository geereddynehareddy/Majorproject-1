if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express=require("express");
const app=express();

console.log(process.env.SECRET);
const methodoverride=require("method-override");
const path=require("path");
app.set("view engine","ejs");
const ejsMate=require("ejs-mate");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
const Joi=require("joi");

app.use(methodoverride("_method"));

const mongoose=require("mongoose");
const dbUrl=process.env.ATLASDB_URL;

console.log("ATLAS:", process.env.ATLASDB_URL);

async function main(){
    await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("Successfully connected to DB"))
  .catch(err => console.log(err));

app.listen(9898,()=>{
    console.log("successfully connected");
});

const listingses=require("./router/listings.js");
const review=require("./router/review.js");
const sign=require("./router/signup.js");
// const store= MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:"mysupersecret",
//     },
//     touchAfter:24*3600,
// });
// store.on("error",()=>{
//     console.log("error in mongosession store",err);
// });
// const sessionoptions={
//     store,
//     secret:"mysupersecret",
//     resave:false,
//     saveUninitialized:true,
//     cookie:{
//         expires:Date.now()+7*24*60*60*1000,
//         maxAge:7*24*60*60*1000,
//         httpOnly:true
//     },
// };

//const sessions=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const isLoggedIn=require("./models/middleware.js");
const session = require("express-session");
const {MongoStore} = require("connect-mongo");

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR", err);
});

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());//usage:ekh website ko pata hone chaheye ki if one user is gng from one page to another they must know that i.e the website must know that same user is gng to that particular page
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("sucessfull");
    res.locals.deleted=req.flash("deleted");
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    res.locals.currentUser=req.user;
    
    next();
});

// app.get("/demouser",async(req,res)=>{
// let fakeUser=new User({
// email:"student@gmail.com",
// username:"delta-student"
// });
// let registeredUser=await User.register(fakeUser,"helloworld");
// res.send(registeredUser);
// });
app.use("/listings",listingses);
app.use("/listings/:id/reviews",review);
app.use("/",sign);

