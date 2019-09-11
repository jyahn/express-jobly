/** Company class for jobly */

const db = require("../db");
const ExpressError = require("../expressError");


/** Company on the site. */

class Company {

  /** ... company -- returns
   *    {change soon}
   */


  static async create({ handle, name, num_employees, description, logo_url }) {
    const result = await db.query(
      `INSERT INTO companies (
              handle,
              name,
              num_employees,
              description,
              logo_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING handle, name, num_employees, description, logo_url`,
      [handle, name, num_employees, description, logo_url]);

    return result.rows[0];

  }

  static async get(search, min_employees, max_employees) {

    let arr = [];
    let arrForSql = [];
    if (search !== undefined) {
      arr.push(`name LIKE '%' || $1 || '%'`)
      arrForSql.push(search);
    }
    if (min_employees !== undefined) {
      arr.push(`num_employees > $2`)
      arrForSql.push(min_employees);
    }
    if (max_employees !== undefined) {
      arr.push(`num_employees < $3`)
      arrForSql.push(max_employees);
    }
    console.log(arr);
    let x = `SELECT * from companies WHERE ${arr.join(" AND ")}`
    console.log("THIS IS LINE 48 --->", x);
    if (arr.length > 0) {
      const result = await db.query(
        `SELECT * from companies WHERE ${arr.join(" AND ")}`,
        arrForSql);
      return result.rows[0];
    } else {
      const result = await db.query(
        `SELECT * from companies`);
    }


  }

}

module.exports = Company;