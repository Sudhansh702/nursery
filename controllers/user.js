const { v4: uuidv4 } = require("uuid");
const { User } = require("../data/models/user");
const Product  = require("../data/models/product");
const { setUser ,getUser} = require("../services/auth");

async function handleUserSignup(req, res) {
  const { username, email, password } = req.body;
  await User.create({
    username,
    email,
    password,
  });
  return res.redirect("/login");
}

async function handleUserLogin(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username, password: password });
  if (!user)
    return res.render("signup", {
      error: "Invalid Username or Password",
    });

  const token = setUser(user);
  res.cookie("uid", token);
  return res.redirect("/");
}


async function addToCart(req, res, next){
  console.log("addToCart")
  
  try {
      const {id} = req.body;
      const user = await getUser(req.cookies.uid);
      await User.findOneAndUpdate(
          { username: user.user.username },
          { $push: { cart: id } },
          { new: true }
      )
      if (!id) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.redirect('/cart');
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
}

  module.exports = {
    handleUserSignup,
     handleUserLogin,
    addToCart,
  };
