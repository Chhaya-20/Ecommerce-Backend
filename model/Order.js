const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  id: {
    type: String
  },
  orders: [Object] // Define the type of elements as Object
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
