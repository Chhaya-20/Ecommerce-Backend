const Seller = require("../model/Seller");
const list = require("../model/Categories");
const bcrypt = require("bcrypt");
const product1 = require("../model/Product");
const jwt = require("jsonwebtoken");

//LOGIN A SELLER
exports.LoginSeller = async (req, res) => {
 
  const { email, password } = req.body;

  try {
    const user = await Seller.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "Chhaya@10", {
      expiresIn: "1d",
    });

    // Set the token to the header
    res.setHeader("Authorization", `Bearer ${token}`);

    return res
      .status(200)
      .json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//REGISTER A SELLER
exports.SignupSeller = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the details carefully",
    });
  }
  try {
    const result = await Seller.findOne({ email });
    if (result != null) {
      return res
        .status(500)
        .json({ success: false, message: "Already User Exist" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Internal Server error");
      }
      try {
     
        const user = new Seller({ name, email, password: hash });
        await user.save();
        const token = jwt.sign({ userId: user._id }, "Chhaya@10", {
          expiresIn: "1d",
        });

        // Set the token to the header
        res.setHeader("Authorization", `Bearer ${token}`);

        return res
          .status(200)
          .json({ success: true, message: "Login successful", token });
      } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).send("Internal Server error");
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server error");
  }
};


exports.Forget = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the details carefully",
    });
  }
  try {
    const result = await Seller.findOne({ email });
    if (result == null) {
      return res
        .status(500)
        .json({ success: false, message: "User do not Exist" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Internal Server error");
      }
      try {
        result.password = hash;
        await result.save();
        return res
          .status(200)
          .json({ success: true, message: "Password Reset Successfully " });
      } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).send("Internal Server error");
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server error");
  }
};




//ADD PRODUCT TO SELLER'S PRODUCT ARRAY 
exports.addProduct = async (req, res) => {
  const sellerid = req.user.id;
  const { name, price, image, desc, selectedItem } = req.body;

  try {
   

    const item = new product1({
      name: name,
      image: image,
      description: desc,
      price: price,
      category: selectedItem,
    });

    await item.save(); // Save the product

    let p = await list.findOne(); // Fetch categories
    if (!p) {
      p = new list(); // Create new categories if not found
    }

    const seller = await Seller.findOne({ _id: sellerid });
    seller.products.push(item); // Add product to seller's products

    // Add product to the appropriate category
    switch (selectedItem) {
      case "Electronic":
        p.Electronic.push({
          id: sellerid,
          id1: item._id,
          name: name,
          image: image,
          description: desc,
          price: price,
          category: selectedItem,
        });
        break;
      case "Clothes":
        p.Clothes.push({
          id: sellerid,
          id1: item._id,
          name: name,
          image: image,
          description: desc,
          price: price,
          category: selectedItem,
        });
        break;
      case "Shoes":
        p.Shoes.push({
          id: sellerid,
          id1: item._id,
          name: name,
          image: image,
          description: desc,
          price: price,
          category: selectedItem,
        });
        break;
      case "Food":
        p.Food.push({
          id: sellerid,
          id1: item._id,
          name: name,
          image: image,
          description: desc,
          price: price,
          category: selectedItem,
        });
        break;
      case "Beauty":
        p.Beauty.push({
          id: sellerid,
          id1: item._id,
          name: name,
          image: image,
          description: desc,
          price: price,
          category: selectedItem,
        });
        break;
      case "Toys":
        p.Toys.push({
          id: sellerid,
          id1: item._id,
          name: name,
          image: image,
          description: desc,
          price: price,
          category: selectedItem,
        });
        break;
      case "Books":
        p.Books.push({
          id: sellerid,
          id1: item._id,
          name: name,
          image: image,
          description: desc,
          price: price,
          category: selectedItem,
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid category" });
    }

    await seller.save(); // Save seller
    await p.save(); // Save categories

    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

//GET ALL PRODUCT OF A PARTICULAR SELLER
exports.getsellerproduct = async (req, res) => {
  const sellerid = req.user.id;
  const seller = await Seller.findOne({ _id: sellerid });
  
  if (seller.products.length == 0) {
    res.status(200).json({ message: "No products Available" });
  } else {
    res.status(200).json(seller.products);
  }
};


//DELETE A PRODUCT OF SELLER
exports.deletes = async (req, res) => {
  const { id, category } = req.body; // Product id and category
  const sellerId = req.user.id;
  

  try {
    let result = await list.findOne();
    let result1 = await Seller.findOne({ _id: sellerId });

    if (!result) {
      return res.status(404).json({ message: "No products found" });
    }

    switch (category) {
      case "Electronic":
        result.Electronic = result.Electronic.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Clothes":
        result.Clothes = result.Clothes.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Shoes":
        result.Shoes = result.Shoes.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Food":
        result.Food = result.Food.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();

        break;
      case "Beauty":
        result.Beauty = result.Beauty.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Toys":
        result.Toys = result.Toys.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Books":
        result.Books = result.Books.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      default:
        return res.status(400).json({ message: "Invalid category" });
    }

    await result.save();

    const p = await product1.findByIdAndDelete({ _id: id });
    await p.save();

    res
      .status(200)
      .json({ message: "Product deleted successfully" }, result, result1);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

//EDIT PRODUCT OF SELLER
exports.edits = async (req, res) => {
  const { name, description, image, price, id, category } = req.body;
  const sellerId = req.user.id;
  try {
    let result = await list.findOne();
    let result1 = await Seller.findOne({ _id: sellerId });

    if (!result) {
      return res.status(404).json({ message: "No products found" });
    }

    switch (category) {
      case "Electronic":
        result.Electronic = result.Electronic.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Clothes":
        result.Clothes = result.Clothes.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Shoes":
        result.Shoes = result.Shoes.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Food":
        result.Food = result.Food.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();

        break;
      case "Beauty":
     
        for (let i = 0; i < result.Beauty.length; i++) {
          if (result.Beauty[i].id1 == id) {
           
            result.Beauty[i].name = name;
            result.Beauty[i].description = description;
            result.Beauty[i].price = price;
            result.Beauty[i].image = image;
            break;
          }
        }

        // Find the product in result1.products array and update its fields
        for (let i = 0; i < result1.products.length; i++) {
          if (result1.products[i]._id == id) {
            result1.products[i].name = name;
            result1.products[i].description = description;
            result1.products[i].price = price;
            result1.products[i].image = image;
            break;
          }
        }
        break;
      case "Toys":
        result.Toys = result.Toys.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      case "Books":
        result.Books = result.Books.filter((item) => item.id1 != id);
        result1.products = result1.products.filter(
          (product) => product._id.toString() !== id
        );
        await result1.save();
        break;
      default:
        return res.status(400).json({ message: "Invalid category" });
    }

    await result.save();
    await result1.save();

    try {
      const p = await product1.findOne({ _id: id });
      p.name = name;
      p.description = description;
      p.image = image;
      p.price = price;
      await p.save();
    } catch (error) {
      return res.status(400).json({ message: "Some error occured..." });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully" }, result, result1);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

//GET ALL ORDERS OF A SELLER (THIS ORDER ARE DONE BY USER)
exports.getorder = async (req, res) => {
  const sellerId = req.user.id;

  try {
    let seller = await Seller.findOne({ _id: sellerId });
    if (seller.orders.length !== 0) {
   
      return res.status(200).json(seller.orders); // Use res.status(200) instead of res.json(200)
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
