const mongoose=require("mongoose");
// async function main(){
//     mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
// }
// main().then(()=>{console.log("successfully connected to db");});
const Schema=mongoose.Schema;
const reviewschema=new Schema({
      content:String,
      rating:{
        type:Number,
        min:1,
        max:5,
       
      },
      created_at:{
        type:Date,
        default:Date.now()
      },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }
});
const reviews=mongoose.model("reviews",reviewschema);
module.exports=reviews;