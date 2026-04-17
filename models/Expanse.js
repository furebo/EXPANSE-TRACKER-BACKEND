const mongoose = require("mongoose");

const ExpanseSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
  icon: {type: String},
  category: {type: String, required:true}, //example: food, Rent, School fees, etc...
  amount: {type: Number, required:true},
  date: {type: Date, default: Date.now}
}, {timestamps:true})

module.exports = mongoose.model("Expanse", ExpanseSchema);