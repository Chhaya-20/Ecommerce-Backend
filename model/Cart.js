const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
  id: {                //user id
    type: String
  },
  cart: [
    {
      item: 
        {
          id: { type: String, required: true },
      id1: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: String, required: true },
      category: { type: String, required: true }

        }
        // type: Object, // You can define the item structure here if it's always the same
        // required: true
  ,
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: String,
        required: true
      }
    }
  ],
  totalprice: {
    type: String
  }
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
