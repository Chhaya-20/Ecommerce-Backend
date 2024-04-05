

const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishListSchema = new Schema({
  id: {
    type: String
  },
  WishList: {
    type: Array // Specify the type of the WishList field as an array
  }
});

const WishList = mongoose.model("WishList", WishListSchema);
module.exports = WishList;
