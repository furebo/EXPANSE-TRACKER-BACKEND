const mongoose = require("mongoose");

const connectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI,{})
       console.log("Connection to Mongo database established successfully.")
    } catch (error) {
        console.log("error connecting to mongodb: ",error)
    }
}
module.exports = connectDB;