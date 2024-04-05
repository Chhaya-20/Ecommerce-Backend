const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategoriesSchema = new Schema({
  Electronic: [
    {
      id: { type: String, required: true },
      id1: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: String, required: true },
      category: { type: String, required: true }
    }
  ],
  Clothes: [
    {
      id: { type: String, required: true },
      id1: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true }
    }
  ],
  Shoes: [
    {
      id: { type: String, required: true },
      id1: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true }
    }
  ],
  Food: [
    {
      id: { type: String, required: true },
      id1: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true }
    }
  ],
  Beauty: [
    {
      id: { type: String, required: true },
      id1: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true }
    }
  ],
  Toys: [
    {
      id: { type: String, required: true },
      id1: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true }
    }
  ],
  Books: [
    {
      id: { type: String, required: true },
      id1: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true }
    }
  ]
});

const Categoriess = mongoose.model("Categoriess", CategoriesSchema);
module.exports = Categoriess;
