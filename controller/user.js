const user=require("../models/user.js");
const passport=require("passport");
module.exports.signUpget=(req,res)=>{
    res.render("signup");
}
module.exports.signUp=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
const newuser=new user({email,username});
const registeredUser=await user.register(newuser,password);

req.login(registeredUser,(err)=>{
    if(err){
        next(err);
    }
    req.flash("success","Welcome to airbnb");
res.redirect("/listings");
});

    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.login=(req,res)=>{
    res.render("login");
}
module.exports.loginPost=async(req,res)=>{// show error message
    // 
           
req.flash("success","Successfully logged in to airbnb");
const url=res.locals.redirectUrl||"/listings"
res.redirect(url);
}
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
        next(err);}
req.flash("success","Successfully LoggedOut!");
res.redirect("/listings");
    });
}