// seed.js
const mongoose = require("mongoose");
const Listing = require("../models/schema.js"); // adjust path if different
const { data: sampleListings } = require("./data.js"); // your file name

const MONGO_URL = "mongodb+srv://airbnb_clone:1Mz5dvjI7RpZ7vxZ@cluster0.dukzqtg.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
}

main()
  .then(() => seedDB())
  .catch((err) => console.log(err));

const seedDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Old listings removed");

    await Listing.insertMany(sampleListings);
    console.log("Sample listings added!");

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};
