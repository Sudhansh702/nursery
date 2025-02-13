const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    rating: { type: Number, default: 0 },
    originalPrice: { type: Number, default: null },
    isOnSale: { type: Boolean, default: false }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
