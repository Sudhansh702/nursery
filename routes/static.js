const express = require("express");
const Product = require("../data/models/product");
const router = express.Router();
const { restrictToLoggedinUserOnly, checkAuth } = require("../middleware/authMiddleware");
const { User , Order } = require("../data/models/user");


router.get('/', async (req, res) => {
  console.log("/route")

  try {
    const allProducts = await Product.find().limit(8);
    const featuredProducts = allProducts.sort(() => 0.5 - Math.random());
    res.render('home', { products: featuredProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('An error occurred while fetching products');
  }
});

//store page
router.get('/store', async (req, res) => {
  console.log("store")

  try {
    const randomProducts = await Product.aggregate([{ $sample: { size: 100 } }]);
    res.render('store', { type: "Store", products: randomProducts });
  } catch (error) {
    console.error('Error fetching random products:', error);
    res.status(500).render('error', { message: 'Server error' });
  }
});

router.get('/store/:type', async (req, res) => {
  try {
    const randomProducts = await Product.aggregate([
      { $match: { category: req.params.type } }
    ]);
    res.render('store', { type: req.params.type, products: randomProducts });
} catch (error) {
  console.error('Error fetching random products:', error);
  res.status(500).render('error', { message: 'Server error' });
}
});

router.get('/about', (req, res) => {
res.render('about');
});

router.get('/contactUs', restrictToLoggedinUserOnly, (req, res) => {
res.render('contactUs');
});

// Optimize store route
router.get('/store', async (req, res) => {
  try {
      const products = await Product.find().limit(100);
      res.render('store', { type: "Store", products });
  } catch (error) {
      res.status(500).render('error', { message: 'Server error' });
  }
});

// Optimize myaccount route
router.get('/myaccount', restrictToLoggedinUserOnly, async (req, res) => {
  console.log("myaccount")
  try {
      const user = await User.findById(req.user.user._id);
      const orders = await Order.find({ username: user.username })
                              .sort({ createdAt: -1 });
      res.render('myaccount', { user, orders });
  } catch (error) {
      res.status(500).render('error', { message: 'Error loading account details' });
  }
});

// Optimize cart route
router.get('/cart', restrictToLoggedinUserOnly, async (req, res) => {
  try {
      const user = await User.findById(req.user.user._id);
      const products = await Product.find({ id: { $in: user.cart } });
      const subtotal = products.reduce((sum, product) => sum + product.price, 0);
      res.render('cart', { user: req.user.user, cartItems: products, subtotal });
  } catch (error) {
      res.status(500).json({ message: 'Error loading cart' });
  }
});
router.get('/cart/remove/:id', restrictToLoggedinUserOnly, async (req, res) => {
  console.log("remove")
  console.log(req.params.id)
  try {
    const user = await User.findById(req.user.user._id);
    console.log(user)
    const cart = user.cart;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i] == req.params.id) {
        cart.splice(i, 1);
        break;
      }
    }
    console.log(cart)
    await User.findByIdAndUpdate(req.user.user._id, { cart: cart });
    res.redirect('/cart');
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});
router.get('/product/:id', restrictToLoggedinUserOnly, async (req, res) => {
  console.log("/product")
  try {
    const product = await Product.findById(req.params.id);
    const similarProduct = await Product.find().limit(4);
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }
    res.render('product', { prod: product, similarProducts: similarProduct, user: req.user });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).render('error', { message: 'Server error' });
  }
});
router.get('/checkout', restrictToLoggedinUserOnly, async (req, res) => {
  console.log("checkout")
  const user = await User.findById(req.user.user._id);
  var products = await Product.find({ id: { $in: user.cart } });
  res.render('checkout', { products});
});



router.get('/test', restrictToLoggedinUserOnly, async (req, res) => {
  console.log("test");
  const prod = await Product.find({ id: 2 });
  console.log(prod);

  res.json("test done");
});
router.get('/empty', (req, res) => {
  res.json('empty');
});


router.post('/cancel-order/:orderId', restrictToLoggedinUserOnly, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    // Update the Order collection
    await Order.findByIdAndUpdate(orderId, {
      status: 'cancelled'
    });

    // Update the orders array in User collection
    await User.updateOne(
      { 'orders.orderId': orderId },
      { 
        $set: { 
          'orders.$.status': 'cancelled'
        }
      }
    );
    
    res.redirect('/myaccount');
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).redirect('/myaccount');
  }
});

module.exports = router;