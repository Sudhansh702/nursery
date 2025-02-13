const express = require("express");
const { handleUserSignup, handleUserLogin, addToCart } = require("../controllers/user");

const { User, Order } = require("../data/models/user");
const { setUser, getUser } = require("../services/auth");
const Product = require("../data/models/product");
// const { sendOrderConfirmation } = require('../services/mailer');

const router = express.Router();
router.post("/register", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/cart/add", addToCart);
router.post("/place-order", async (req, res) => {
    console.log("place-order")
    try {
        var user = await getUser(req.cookies.uid);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        user = await User.findOne({ username: user.user.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
 
        const cart = user.cart;
        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const { firstname, lastname, street_address, city, state, pin_code, country, phone } = req.body;
        if (!firstname || !lastname || !street_address || !city || !state || !pin_code || !country || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        var products = await Product.find({ id: { $in: user.cart } });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'Products not found' });
        }

        let totalPrice = 0;
        for (const product of products) {
            totalPrice += product.price;
        }
        products = products.map(product => ({ id: product.id, name: product.name }));

        const newOrder = new Order({
            username: user.username,
            firstname,
            lastname,
            address: {
                street_address,
                city,
                state,
                pin_code,
                country,
                phone,
                mail: user.email
            },
            products: products,
            totalPrice,
            status: 'pending'
        });
        await newOrder.save();
        
        await User.findOneAndUpdate(
            { username: user.username },
            {
                $push: { 'orders': { orderId: newOrder._id, products: cart.map(id => ({ id })) } },
                cart: []
            },
            { new: true }
        );

        await User.findOneAndUpdate(
            { username: user.username },
            {
                phone,
                address: {
                    addressLine1: street_address,
                    city,
                    state,
                    postalCode: pin_code,
                    country
                },
                updatedAt: Date.now()
            },
            { new: true }
        );

        // Send order confirmation email
        // await sendOrderConfirmation({
        //     email: user.email,
        //     orderId: newOrder._id,
        //     products: products,
        //     totalPrice,
        //     shippingAddress: {
        //         firstname,
        //         lastname,
        //         street_address,
        //         city,
        //         state,
        //         pin_code,
        //         country,
        //         phone
        //     }
        // });

        res.redirect('/myaccount');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order' });
    }
});


router.post('/cancel-order/:orderId', async (req, res) => {
    try {
        if (!req.user || !req.user.user || !req.user.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(req.user.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Order.findByIdAndUpdate(req.params.orderId, { status: 'cancelled' });
        await User.findOneAndUpdate(
            { username: user.username },
            { $pull: { 'orders': { orderId: req.params.orderId } } }
        );
        await sendOrderCancellation({
            email: user.email,
            orderId: req.params.orderId,
            products: order.products,
            totalPrice: order.totalPrice,
            cancellationDate: new Date()
        });
        res.redirect('/myaccount');
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Error canceling order' });
    }
});


router.post('/delete-order/:orderId', async (req, res) => {
    try {
        const user = await getUser(req.cookies.uid);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'cancelled') {
            return res.status(400).json({ message: 'Only cancelled orders can be deleted' });
        }

        await Order.findByIdAndDelete(req.params.orderId);
        await User.findOneAndUpdate(
            { username: user.user.username },
            { $pull: { 'orders': { orderId: req.params.orderId } } }
        );

        res.redirect('/myaccount');
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
});

module.exports = router;