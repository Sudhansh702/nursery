const { getUser } = require("../services/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
  const userUid = req.cookies.uid;
  
  if (!userUid) return res.redirect("/login"); 
  const user = getUser(userUid); 
  
  if (!user) return res.redirect("/login");
  console.log("middleware")
  // console.log(user)

  // console.log("middlewareend")
  req.user = user;
  next();
}
 
async function checkAuth(req, res, next) {
  const userUid = req.cookies.uid;

  const user = getUser(userUid);
  
  req.user = user;
  next();
}
// const errorHandler = (err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).render('error', { message: 'Something went wrong!' });
// };

// router.use(errorHandler);


module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth
};
