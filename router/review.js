const express=require("express");
const route=express.Router({mergeParams:true});
const review=require("../models/review.js");
const expresserror=require("../utils/expresserror.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewschema}=require("../schema.js");
const listings=require("../models/schema.js");
const {isLoggedIn,isOwner,isReviewOwner,validateReview}=require("../models/middleware.js");
const Reviewcontrol=require("../controller/reviews.js");

route.post("/",isLoggedIn,validateReview,wrapAsync(Reviewcontrol.ReviewPost));
route.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(Reviewcontrol.ReviewDelete));


route.use((err,req,res,next)=>{
const {status=500,message="Something went wrong"}=err;
   res.status(status).render("error.ejs",{err});
    
});
module.exports=route;