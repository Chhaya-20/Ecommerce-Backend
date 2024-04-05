const Cart = require("../model/Cart.js");

const Order = require("../model/Order.js");

const Product = require("../model/Product.js");

const wishList = require("../model/WishList.js");

const Seller = require("../model/Seller.js");

const User = require("../model/User.js");

//ADD TO CART OF USER
exports.AddtoCart = async (req, res) => {
  let { price } = req.body; //product id
  const { id1 } = req.body;

  price = parseInt(price);
  const userId = req.user.id; // user id
  let result = await Cart.findOne({ id: userId });

  try {
    if (result === null) {
      item = new Cart({
        id: userId,
        cart: [{ item: req.body, quantity: 1, price: price }],
        totalprice: price,
      });
      await item.save();
      return res.status(200).json("Successfully Added ");
    } else {
      let f = true;
      for (let i = 0; i < result.cart.length; i++) {
        if (result.cart[i].item.id1 == id1) {
          result.cart[i].quantity = result.cart[i].quantity + 1;

          result.cart[i].price =
            parseInt(result.cart[i].price) + parseInt(price);

          f = false;

          await result.save();

          return res.status(200).json({ message: "Succesfully Added" });
        }
      }
      if (f) {
        result.cart.push({ item: req.body, quantity: 1, price: price });
        result.totalprice = parseInt(result.totalprice) + parseInt(price);
        await result.save();
        return res.status(200).json({ message: "Succesfully Added" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server error");
  }
};

//ORDER ALL PRODUCT AVAILABLE IN USER CART
exports.OrderAll = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user's cart
    const result = await Cart.findOne({ id: userId });
    if (!result) {
      return res.status(404).send("Cart not found");
    }

    // Check if the cart is empty
    if (result.cart.length === 0) {
      return res.status(400).send("Cart is empty");
    }

    // Find or create the user's order
    let order = await Order.findOne({ id: userId });
    if (!order) {
      // Create a new order if none exists
      order = new Order({ id: userId, orders: result.cart });
    } else {
      // Add cart items to the existing order
      order.orders = order.orders.concat(result.cart);
    }

    // Save the order
    await order.save();
    result.cart = [];
    await result.save();

    return res.status(200).send("Successfully Ordered");
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server error");
  }
};

// GET CART OF USER
exports.getCart = async (req, res) => {
  const userId = req.user.id;
  const result = await Cart.findOne({ id: userId });

  if (!result) {
    return res.status(200).json({ message: "No product in cart" });
  } else {
    return res.status(200).json(result.cart);
  }
};

//INCREASE AND DECREASE QUNATITY OD PRODUCT IN USER CART
// exports.IncAndDec = async (req, res) => {
//   const userId = req.user.id;
//   const { id, type } = req.body;
//   let result = await Cart.findOne({ id: userId });
//   // console.log(result,id)
//   const pr = await Product.findOne({ _id: id });
//   try {
//     for (let i = 0; i < result.cart.length; i++) {
//       if (result.cart[i].item.id1 == id) {
//         console.log(result.cart[i])
//         if (type == "inc") {
//           result.cart[i].quantity = result.cart[i].quantity + 1;

//           result.cart[i].item.price = parseInt(result.cart[i].item.price) + parseInt(pr.price);

//           result.totalprice = parseInt(result.totalprice) + parseInt(pr.price);

//           await result.save();

//           return res.status(200).json({ message: "Succesfully Added" });
//         } else {
//           if (result.cart[i].quantity == 1) {
//             result.cart.splice(i, 1);
//             result.totalprice = result.totalprice - parseInt(pr.price);
//             await result.save();
//             return res.status(200).json({ message: "Successfully Removed" });
//           } else {
//             result.cart[i].quantity = result.cart[i].quantity - 1;

//             result.cart[i].item.price = parseInt(result.cart[i].price) - parseInt(pr.price);

//             result.totalprice = parseInt(result.totalprice) - parseInt(pr.price);

//             await result.save();

//             return res.status(200).json({ message: "Succesfully Removed" });
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal Server error");
//   }

//   // await result.save(); // Save the updated cart document
//   // return res.status(200).send("Successfully Added ");
// };

exports.IncAndDec = async (req, res) => {
  const userId = req.user.id;
  const { id, type } = req.body;

  try {
    let result = await Cart.findOne({ id: userId });
    const pr = await Product.findOne({ _id: id });

    if (!result) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let updatedTotalPrice = parseInt(result.totalprice); // Initialize updated total price
    console.log(updatedTotalPrice);
    for (let i = 0; i < result.cart.length; i++) {
      if (result.cart[i].item.id1 == id) {
        if (type == "inc") {
          result.cart[i].quantity++;
          result.cart[i].price =
          parseInt(result.cart[i].price) + parseInt(pr.price);
          updatedTotalPrice += parseInt(pr.price);
        } else {
          if (result.cart[i].quantity == 1) {
            result.cart.splice(i, 1);
            updatedTotalPrice -= parseInt(pr.price);
          } else {
            result.cart[i].quantity--;
            result.cart[i].price =
            parseInt(result.cart[i].price) - parseInt(pr.price);
        
            updatedTotalPrice -= parseInt(pr.price);
          }
        }

        // Update item price in the cart
       

        break; // Exit loop after updating item
      }
    }

    // Update total price in the cart
    result.totalprice = updatedTotalPrice.toString();

    await result.save();

    if (type === "inc") {
      return res.status(200).json({ message: "Successfully Added" });
    } else {
      return res.status(200).json({ message: "Successfully Removed" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server error");
  }
};

//BUY A PARTICULAR PRODUCT IN USER CART
exports.buy = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Cart.findOne({ id: userId });

    if (!result) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const carts = result.cart;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].item.id1 === req.body.item.id1) {
        result.totalprice =
          parseInt(result.totalprice) - parseInt(carts[i].price);
        result.cart.splice(i, 1);
        await result.save();
        break;
      }
    }

    // Check if an order exists for the user
    let order = await Order.findOne({ id: userId });

    // If no order exists, create a new one
    if (!order) {
      order = new Order({
        id: userId,
        orders: [req.body],
      });
    } else {
      // If an order exists, push the new order to the existing order document
      order.orders.push(req.body);
    }

    // Save the order once
    await order.save();

    // Find the seller and add the order details to the seller's orders array
    const seller = await Seller.findOne({ _id: req.body.item.id });
    seller.orders.push({
      id: userId,
      item: req.body.item,
      quantity: req.body.quantity,
      price: req.body.price,
    });
    await seller.save();

    return res.status(200).json({ message: "Order Placed Successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//GET ALL ORDER OF PARTICULAR USER
exports.getOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await Order.findOne({ id: userId });

    if (!result) {
      return res.status(200).send("No order yet");
    } else {
      return res.status(200).json(result.orders);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server error");
  }
};

//GET WISHLIST OF A USER
exports.getWishlist = async (req, res) => {
  console.log("here");
  const userId = req.user.id;
  const result = await wishList.findOne({ id: userId });

  if (!result) {
    return res.status(400).send("No product in wishlist");
  } else {
    return res.status(200).json(result.WishList);
  }
};

exports.AddtoCart1 = async (req, res) => {
  console.log("ekfbjw");
  try {
    const { id } = req.body;
    const userId = req.user.id;

    // Find the user's cart
    let result = await Cart.findOne({ id: userId });
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!result) {
      // If the cart doesn't exist, create a new one
      const item = new Cart({
        id: userId,
        cart: [{ item: product, quantity: 1, price: product.price }],
        totalprice: product.price,
      });
      await item.save();
      return res.status(200).json({ message: "Successfully Added to Cart" });
    } else {
      // If the cart exists, check if the product is already in the cart
      let f = true;
      for (let i = 0; i < result.cart.length; i++) {
        if (result.cart[i].item.id === id) {
          console.log("here");
          f = false;
          result.cart[i].quantity += 1;
          result.totalprice += product.price;
          await result.save();
          return res
            .status(200)
            .json({ message: "Successfully Added to Cart" });
        }
      }

      // If the product is not in the cart, add it
      if (f) {
        result.cart.push({ item: product, quantity: 1, price: product.price });
        result.totalprice += product.price;
        await result.save();
        return res.status(200).json({ message: "Successfully Added to Cart" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  const wish = await wishList.findOne({ id: userId });
  console.log();
  wish.WishList = wish.WishList.filter((item) => item.id1 !== id);
  await wish.save();
};

//ADD TO WISHLIST OF USER
exports.Wishlist = async (req, res) => {
  let { price } = req.body;
  const { id1 } = req.body;
  console.log(req.body);

  price = parseInt(price);
  const userId = req.user.id; // user id
  let result = await wishList.findOne({ id: userId });

  try {
    if (result === null) {
      item = new wishList({
        id: userId,
        WishList: [req.body],
      });
      await item.save();
      return res.status(200).json("Successfully Added ");
    } else {
      for (let i = 0; i < result.WishList.length; i++) {
        if (result.WishList[i].id1 == id1) {
          return res.status(200).json("Product already exist in your WishList");
        }
      }
      result.WishList.push(req.body);
      await result.save();
      return res.status(200).json("Successfully Added ");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server error");
  }
};

exports.Removewish = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.body;
  try {
    const wish = await wishList.findOne({ id: userId });

    for (let i = 0; i < wish.WishList.length; i++) {
      if (wish.WishList[i].id1 == id) {
        wish.WishList.splice(i, 1);
        await wish.save();
        return res.status(200).json("Successfully Deleted");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server error");
  }
};
