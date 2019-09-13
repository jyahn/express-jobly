/** Routes for Users */

const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const jsonschema = require("jsonschema");
const newUserSchema = require("../schemas/newUserSchema.json");
const patchUserSchema = require("../schemas/patchUserSchema.json");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");




/** POST / user data => {user: newUser} */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, newUserSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const { username, is_admin } = req.body;
    const user = await User.create(req.body);
    if (user) {
      let token = jwt.sign({ username }, SECRET_KEY)
      return res.status(201).json({ token, is_admin });
    }
  }
  catch (err) {
    return next(err);
  }
});


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, email, photo_url, is_admin}, ...]}
 *
 **/

router.get("/", async function (req, res, next) {
  try {
    let users = await User.all();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /:handle => {company: company} */

router.get("/:username", async function (req, res, next) {
  try {
    let username = req.params.username;
    const user = await User.getByHandle(username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
})


router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, patchUserSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    let username = req.params.username;
    const user = await User.update(username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }

})

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    let username = (req.params.username);
    await User.delete(username);
    return res.json({ message: "User deleted" });
  } catch (err) {
    return next(err);
  }
})


module.exports = router;