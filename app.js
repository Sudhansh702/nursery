const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/authMiddleware");

const staticRoute = require("./routes/static");
const userRoute = require("./routes/user");

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('frontend'));


app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/signup", (req, res) => {
  console.log("signup")
  res.render("signup");
});

app.get("/login", (req, res) => {
  console.log("login")
  res.render("signup");
});

app.post("/logout", (req, res) => {
  console.log("logout")
  res.clearCookie("uid");
  return res.redirect("/");
});


const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






















// var createError = require('http-errors');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const express = require('express');
// const expressSession = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const path = require('path');
// const mongoose = require('mongoose');
// const flash = require('connect-flash');
// const dotenv = require('dotenv');
// dotenv.config();


// const app = express(); 

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'frontend'));

// const Product = require('./data/models/product');
// var { User } = require('./data/models/user');
// const usersRouter  = require('./routes/user');





// passport.use(new LocalStrategy(User.authenticate()));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'frontend')));



// app.use(expressSession({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }));

// app.use(passport.initialize());//session initialize
// app.use(passport.session());//session save
// passport.serializeUser(usersRouter.serializeUser());

// passport.deserializeUser(usersRouter.deserializeUser());
// app.use(flash);

// app.get('/',  async (req, res) => {
//   try {
//     const allProducts = await Product.find().limit(8);
//     const featuredProducts = allProducts.sort(() => 0.5 - Math.random());
//     res.render('home', { products: featuredProducts });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).send('An error occurred while fetching products');
//   }
// });

// app.get('/store', async (req, res) => {
//   try {
//     const randomProducts = await Product.aggregate([{ $sample: { size: 100 } }]);
//     res.render('store', { type: "Store", products: randomProducts });
//   } catch (error) {
//     console.error('Error fetching random products:', error);
//     res.status(500).render('error', { message: 'Server error' });
//   }
// });

// app.get('/store/:type', async (req, res) => {
//   try {
//     const randomProducts = await Product.aggregate([
//       { $match: { category: req.params.type } }
//     ]);
//     res.render('store', { type: req.params.type, products: randomProducts });
//   } catch (error) {
//     console.error('Error fetching random products:', error);
//     res.status(500).render('error', { message: 'Server error' });
//   }
// });

// app.get('/about', (req, res) => {
//   res.render('about');
// });

// app.get('/contactUs', (req, res) => {
//   res.render('contactUs');
// });

// app.get('/myAccount', (req, res) => {
//   res.render('myAccount');
// });


// app.get('/product/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     const similarProduct = await Product.find().limit(4);
//     if (!product) {
//       return res.status(404).render('error', { message: 'Product not found' });
//     }
//     res.render('product', { prod: product, similarProducts: similarProduct });
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     res.status(500).render('error', { message: 'Server error' });
//   }
// });


// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;
