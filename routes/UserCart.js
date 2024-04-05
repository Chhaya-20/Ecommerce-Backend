const express = require("express");
const router = express.Router();
const { fetchUser } = require("../controllers/middleware");
const {
  AddtoCart,
  OrderAll,
  getCart,
  IncAndDec,
  buy,
  getOrder,
  Wishlist,
  getWishlist,
  AddtoCart1,
  Removewish
} = require("../controllers/Cart-Wishlist");
const { getProducts } = require("../controllers/Product");



router.post("/add", fetchUser, AddtoCart);

router.post("/orderall", fetchUser, OrderAll);

router.get("/getCart", fetchUser,getCart);

router.put("/getCart", fetchUser, IncAndDec);

router.post("/order", fetchUser, buy);

router.get("/getorder", fetchUser, getOrder);

router.post("/wishlist", fetchUser, Wishlist);

router.get("/getwishlist", fetchUser, getWishlist);

router.post("/addcart", fetchUser, AddtoCart1);
router.get("/:cat", getProducts);



router.delete("/wishlist",fetchUser,Removewish)
module.exports = router;
