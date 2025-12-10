const mongoose=require("mongoose");
async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
main().then(()=>{console.log("successfully connected to db");});
const initdata=require("./data.js");
const listing=require('../models/schema.js');
const initDB=async ()=>{
   await listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj,owner:"68ad4685434fec442aa9ee0d"}));
await listing.insertMany(initdata.data);
}
initDB();