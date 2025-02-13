const mongoose = require('mongoose');
const { stringify } = require('uuid');

// User 
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: {
        addressLine1: { type: String },
        addressLine2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    orders: [{
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        products: [
            {
                id: { type: Number }
            }
        ]}
    ],
    cart: [Number]
});

// Order 
const orderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: {
        street_address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pin_code: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        mail: { type: String, required: true },
    },
    products: [{
        id: { type: Number },
        name: { type: String }
    }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { User, Order };