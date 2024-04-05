const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  

    name:{
        type:String
    },
    category:{
        type:String

    },
    price:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    }
  
});

const Product = mongoose.model("products", ProductSchema);
module.exports = Product;


