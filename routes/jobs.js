/** Routes for Jobs */

const Router = require("express").Router;
const router = new Router();

const Job = require("../models/job");
const jsonschema = require("jsonschema");
// const companySchema = require("../schemas/companySchema"); --> replace with userschema

const ExpressError = require("../expressError");



/** POST / job data => {job: newJob} */


//is this post route correct?

router.post("/", async function (req, res, next) {
  try {
    // const result = jsonschema.validate(req.body, companySchema);

    // if (!result.valid) {
    //   let listOfErrors = result.errors.map(error => error.stack);
    //   let error = new ExpressError(listOfErrors, 400);
    //   return next(error);
    // }

    const job = await Job.create(req.body);

    return res.status(201).json(job);
  }
  catch (err) {
    return next(err);
  }
});






module.exports = router;