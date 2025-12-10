const express=require("express");
const route=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const user=require("../models/user.js");
const passport=require("passport");
const SignUp=require("../controller/user.js");

const {savedredirectUrl}=require("../models/middleware.js");
//signup
route.route("/signup")
.get(SignUp.signUpget)
.post(wrapAsync(SignUp.signUp));
//login
route.route("/login")
.get(SignUp.login)
.post(savedredirectUrl,passport.authenticate('local',
    {failureRedirect:'/login',// if login fails, go back to login
        failureFlash:true }),SignUp.loginPost);
 //logout
route.get("/logout",SignUp.logout);
module.exports=route;