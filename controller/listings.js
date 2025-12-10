const listings=require("../models/schema.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});
const {listingSchema,reviewschema}=require("../schema.js");
const expresserror = require("../utils/expresserror");
// 


// module.exports.index = async (req, res) => {
//   const { category } = req.query;
//   let listingss;

//   if (category) {
//     listingss = await listings.find({
//       category: { $regex: new RegExp(`^${category}$`, "i") }
//     });
//   } else {
//     listingss = await listings.find({});
//   }

//   res.render('index', { listingss, currentUser: req.user });
// };

module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let query = {};

  // If search bar used
  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ]
    };
  }

  // If category filter used
  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }

  const listing = await listings.find(query);

  res.render("index", { listing, currentUser: req.user });
};



module.exports.new = (req, res) => {
    res.render("new.ejs");
};
module.exports.newpost=async(req,res)=>{
    let response=await geocodingClient.forwardGeocode({
  query: req.body.listings.location,
  limit: 2
})
  .send();
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
   // let listing=req.body.listing;
let result=listingSchema.validate(req.body);
if(result.error){
    throw new expresserror(400,result.error);
}
        let list=new listings(req.body.listings);
         list.owner=req.user._id;
         list.image={url,filename};
         list.geometry=response.body.features[0].geometry;
       let savedListing=await list.save();
         await list.save();
      console.log(savedListing);
       req.flash("sucessfull","new listings created");
        res.redirect("/listings");      
}
module.exports.show=async(req,res)=>{
        const {id}=req.params;
        const list=await listings.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
        if(!list){
            req.flash("error","NO listing with that id exist");
            res.redirect("/listings");
        }
        res.render("show.ejs",{list});
    }
    module.exports.edit=async(req,res)=>{
        const {id}=req.params;
        const list=await listings.findById(id);
        let originalImageUrl = list.image.url;
originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250");
res.render("edit.ejs", { list, originalImageUrl });
    }
    module.exports.editput=async(req,res)=>{
        let result=listingSchema.validate(req.body);
        if(result.error){
            throw new expresserror(404,result.error);
        }
       const {id}=req.params;
        const list=await listings.findByIdAndUpdate(id,{...req.body.listings});
        if(typeof req.file!=="undefined"){
         let url=req.file.path;
    let filename=req.file.filename;
    list.image={url,filename};
    await list.save();
        res.redirect("/listings");
        }
    }
    
    module.exports.delete=async(req,res)=>{
    const {id}=req.params;
    const list=await listings.findByIdAndDelete(id);
    req.flash("deleted","listings deleted");
    res.redirect("/listings");
}
 // your listing schema


