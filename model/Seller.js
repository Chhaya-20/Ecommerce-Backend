const mongoose = require("mongoose");
const { Schema } = mongoose;
const { format } = require('date-fns'); // Import format function from date-fns

const SellerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  products: [
    {
      name: {
        type: String,
      },
      price: {
        type: String,
      },
      image: {
        type: String,
      },
      description: {
        type: String,
      },
      category: {
        type: String,
      },
    },
  ],
  orders: [
    {
      id: {
        type: String,
      },
      item: {
        type: Object,
      },
      quantity: {
        type: Number,
      },
      price: {
        type: String,
      },
      date: {
        type: String, 
        default: () => format(new Date(), 'dd/MM/yyyy'), 
      },
    },
  ],
});

const Seller = mongoose.model("Seller", SellerSchema);
module.exports = Seller;
