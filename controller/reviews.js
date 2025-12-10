const review=require("../models/review.js");
const listings=require("../models/schema.js");
module.exports.ReviewPost=async(req,res,next)=>{
    const listing=await listings.findById(req.params.id);
    const review1=new review(req.body.review);
    review1.author = req.user._id; 
     await review1.save();
     const resi=await listing.reviews.push(review1);
   
   
    await listing.save();


    res.redirect(`/listings/${listing._id}`);
}
module.exports.ReviewDelete=async(req,res)=>{
    let {id,reviewId}=req.params;
   await listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`);
}
