/** Job class for jobly */

const db = require("../db");
const ExpressError = require("../expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


/** Jobs on the site. */

class Job {

  /** Add new job */

  static async create({ title, salary, equity, company_handle }) {
    const result = await db.query(
      `INSERT INTO jobs (
        title,
        salary,
        equity,
        company_handle,
        date_posted)
        VALUES ($1, $2, $3, $4, current_timestamp)
        RETURNING title, salary, equity, company_handle, date_posted`,
      [title, salary, equity, company_handle]);
    return result.rows[0];
  }

  




}


module.exports = Job;