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


module.exports = router;