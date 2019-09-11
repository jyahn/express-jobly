const Router = require("express").Router;
const router = new Router();

const Company = require("../models/company");


/** POST / - post company.
 *
 *
 **/
router.post("/", async function (req, res, next) {
  try {
    const company = await Company.create({
      handle: req.body.handle,
      name: req.body.name,
      num_employees: req.body.num_employees,
      description: req.body.description,
      logo_url: req.body.logo_url
    });
    return res.json(company);
  }
  catch (err) {
    next(err);
  }
});


router.get("/", async function (req, res, next) {
  try {
    console.log("THIS IS REQ.QUERY-->", req.query);
    let searchQ = req.query.search;
    let minE = req.query.min_employees;
    let maxE = req.query.max_employees;
    console.log("MAXE", maxE);
    const companies = await Company.get(searchQ, minE, maxE);
    return res.json({companies});
  } catch (err) {
    next(err);
  }
})



module.exports = router;