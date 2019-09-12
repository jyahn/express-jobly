/** Routes for Companies */

const Router = require("express").Router;
const router = new Router();

const Company = require("../models/company");
const jsonschema = require("jsonschema");
const companySchema = require("../schemas/newCompanySchema.json");
const ExpressError = require("../expressError");



/** POST / company data => {company: newCompany} */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, companySchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const company = await Company.create(req.body);
    return res.status(201).json(company);
  }
  catch (err) {
    return next(err);
  }
});


/** GET / => {companies: [company, ...]} */

router.get("/", async function (req, res, next) {
  try {
    let searchQ = req.query.search;
    let minE = req.query.min_employees;
    let maxE = req.query.max_employees;
    const companies = await Company.get(searchQ, minE, maxE);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
})

/** GET /:handle => {company: company} */

router.get("/:handle", async function (req, res, next) {
  try {
    let handle = req.params.handle;
    const company = await Company.getByHandle(handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
})

/** PATCH /:handle  companyData => {company: updatedCompany} */

router.patch("/:handle", async function (req, res, next) {
  try {
    // const result = jsonschema.validate(req.body, companySchema);

    // if (!result.valid) {
    //   let listOfErrors = result.errors.map(error => error.stack);
    //   let error = new ExpressError(listOfErrors, 400);
    //   return next(error);
    // }
    let handle = req.params.handle;
    const company = await Company.update(handle, {
      handle: req.body.handle,
      name: req.body.name,
      num_employees: req.body.num_employees,
      description: req.body.description,
      logo_url: req.body.logo_url
    });
    return res.json({ company });
  } catch (err) {
    return next(err);
  }


})

/** DELETE /:handle => { message: "Company deleted" } */

router.delete("/:handle", async function (req, res, next) {
  try {
    let handle = req.params.handle;
    // const company = await Company.delete(handle)==> don't need this line
    await Company.delete(handle);
    return res.json({ message: "Company deleted" });
  } catch (err) {
    return next(err);
  }
})


module.exports = router;