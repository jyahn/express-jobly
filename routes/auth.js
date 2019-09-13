/** Routes for authenticating user */

const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const ExpressError = require("../expressError");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");



/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const isAuthenticated = await User.authenticate(username, password);
    if (isAuthenticated) {
      let user = await User.getByUsername(username);
      let userAdminVal = user.is_admin
      let token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token, is_admin: userAdminVal });
    }
    throw new ExpressError("Invalid user/password", 400);
  }
  catch (err) {
    return next(err);
  }
})


module.exports = router;