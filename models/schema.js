const mongoose=require("mongoose");
// async function main(){
//     mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
// }
// main().then(()=>{console.log("successfully connected to db");});
const Schema=mongoose.Schema;
const reviews=require("./review");
// const { reviewschema } = require("./schema");
const listingschema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    price:Number,
    image:{
        // type:String,
        // default:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        // set:(v)=>v===""?"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80":v,
        url:String,
        filename:String,
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"reviews"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:String,
    location:String,
    country:String,
    geometry:{
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },

    }
);
const newlisting=mongoose.model("newlisting",listingschema);
module.exports=newlisting;

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviews.deleteMany({_id:{$in:listing.reviews}});
    }


});