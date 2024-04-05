const express = require("express");
const app = express();
const port = 3000;
const UserRoutes = require("./routes/UserRoutes.js");
const UserCart = require("./routes/UserCart.js");
const UserSeller = require("./routes/UserSeller.js");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Mount routes
app.use("/api/user", UserRoutes);
app.use("/api/cart", UserCart); // Mount the UserCart router under /api/cart
app.use("/api/seller", UserSeller);

async function main() {
  try {
    //await mongoose.connect("mongodb+srv://chayachugh9:BVvMNCCAPfRE9x7A@cluster0.wtezp2a.mongodb.net/mydb");
    await mongoose.connect(
      "mongodb+srv://chayachugh9:BVvMNCCAPfRE9x7A@cluster0.wtezp2a.mongodb.net/mydb"
    );
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

main().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});

// KBlSDoMPYUxYrPph
