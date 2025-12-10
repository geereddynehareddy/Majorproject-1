const listing=require("./schema.js");
const review=require("./review.js");
const {reviewschema}=require("../schema.js");
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errMsg);
    }else{
        next();
    }};



module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in!");
       return res.redirect("/login");
    }
    next();
}
module.exports.savedredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
     const {id}=req.params;
    const list=await listing.findById(id);
    if(!list.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to edit");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewOwner=async(req,res,next)=>{
     const {id,reviewId}=req.params;
    const Review=await review.findById(reviewId);
    if(!Review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}