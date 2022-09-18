const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  price: {
    type: Number,
    required: [true, "Please provide price"],
  },
  image: {
    type: String,
    required: [true, "Please provide image"],
  },
});

module.exports = mongoose.model("Product", ProductSchema);
