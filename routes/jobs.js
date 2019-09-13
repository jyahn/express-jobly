/** Routes for Jobs */

const Router = require("express").Router;
const router = new Router();

const Job = require("../models/job");
const jsonschema = require("jsonschema");
const newJobSchema = require("../schemas/newJobSchema.json");
const patchJobSchema = require("../schemas/patchJobSchema.json");
const ExpressError = require("../expressError");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");
router.use(ensureLoggedIn);


/** POST / job data => {job: newJob} */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, newJobSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const job = await Job.create(req.body);

    return res.status(201).json(job);
  }
  catch (err) {
    return next(err);
  }
});

/** GET / => {jobs: [job, ...]} */

router.get("/", async function (req, res, next) {
  try {
    let searchQ = req.query.search;
    let minSalary = req.query.min_salary;
    let minEquity = req.query.min_equity;
    const jobs = await Job.get(searchQ, minSalary, minEquity);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
})


/** GET /:id => {jobs: job} */

router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    const job = await Job.getById(id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
})


/** PATCH /:id  jobData => {job: updatedJob} */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, patchJobSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    let id = req.params.id;
    const job = await Job.update(id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }

})

/** DELETE /:handle => { message: "Job deleted" } */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    let id = req.params.id;
    await Job.delete(id);
    return res.json({ message: "Job deleted" });
  } catch (err) {
    return next(err);
  }
})


module.exports = router;