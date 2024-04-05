const express = require('express');
const router = express.Router();
const { fetchUser } = require('../controllers/middleware1');

const {LoginSeller,SignupSeller , Forget,getorder,addProduct,getsellerproduct,deletes,edits} = require('../controllers/Seller')



//LOGIN USER
router.post('/login',LoginSeller)


//SIGNUP USER
router.post('/signup',SignupSeller)

//Forget password
router.post('/forget',Forget)


router.get('/orders',fetchUser,getorder)

router.post('/addproduct',fetchUser,addProduct)


router.get('/getsellerproduct',fetchUser,getsellerproduct);


router.delete("/delete",fetchUser,deletes);

router.put("/edit",fetchUser,edits);





module.exports = router;
