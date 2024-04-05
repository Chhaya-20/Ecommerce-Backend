const Product = require("../model/Categories");

exports.getProducts = async (req, res) => {
  const category = req.params.cat;

  try {
    
    const products = await Product.findOne();
    console.log(products[category])
  
    if (!products) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }
   
    res.json(products[category]);
  } catch (error) {
   
    res.status(500).json({ message: "Internal Server Error" });
  }
};
