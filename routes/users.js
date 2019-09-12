/** Routes for Users */

const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const jsonschema = require("jsonschema");
const companySchema = require("../schemas/newCompanySchema.json");
const ExpressError = require("../expressError");



/** POST / user data => {user: newUser} */

router.post("/", async function (req, res, next) {
  try {
    // const result = jsonschema.validate(req.body, companySchema);

    // if (!result.valid) {
    //   let listOfErrors = result.errors.map(error => error.stack);
    //   let error = new ExpressError(listOfErrors, 400);
    //   return next(error);
    // }
    const user = await User.create(req.body);
    return res.status(201).json(user);
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



router.patch("/:username", async function (req, res, next) {
  try {
    let username = req.params.username;
    const user = await User.update(username, {
      username: req.body.username,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      photo_url: req.body.photo_url,
      is_admin: req.body.is_admin

    });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }

})


router.delete("/:username", async function (req, res, next) {
  try {
    let username = (req.params.username);
    await User.delete(username);
    return res.json({ message: "User deleted" });
  } catch (err) {
    return next(err);
  }
})


module.exports = router;