const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const products = require('./data/products');

const Product = require('./data/models/product');

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nursery', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await Product.deleteMany({}); 

    for (let product of products) {
      await Product.create(product);
    }
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedProducts();
