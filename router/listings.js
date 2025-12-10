const express=require("express");
const route=express.Router();
const expresserror=require("../utils/expresserror.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewschema}=require("../schema.js");
const listings=require("../models/schema.js");
const flash=require("connect-flash");
const {isLoggedIn}=require("../models/middleware.js");
const {isOwner}=require("../models/middleware.js");
const Listingcontrol=require("../controller/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudinary.js");
const upload = multer({ storage });
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errMsg);
    }else{
        next();
    }};

    
    //new route
    route.route("/new")//route see 2nd line from first route=express.Router() so its a name in apnacollege she kept router but route is the name that you have named its ok its just that do not confuse that is it
    .get(isLoggedIn,Listingcontrol.new)
    .post(isLoggedIn,upload.single('listings[image]'),wrapAsync(Listingcontrol.newpost));
    // .post(upload.single('listings[image]'),(req,res)=>{
    //     res.send(req.file);
    // });
    //edit route
    route.route("/edit/:id")
    .get(isLoggedIn,wrapAsync (Listingcontrol.edit))
    .put(isOwner,upload.single('listings[image]'),wrapAsync (Listingcontrol.editput));
//index route
route.get("/",wrapAsync(Listingcontrol.index));
  //filter
route
  .route("/filter")
  .get(wrapAsync(Listingcontrol.index));

    
//show route
    route.get("/:id",wrapAsync (Listingcontrol.show));
   

//delete route
route.delete("/delete/:id",isLoggedIn,isOwner, wrapAsync (Listingcontrol.delete));
module.exports=route;