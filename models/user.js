/** User class for jobly */

const db = require("../db");
const ExpressError = require("../expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


/** User on the site. */

class User {

  /** Add new user */

  static async create({  }) {
    const result = await db.query(
      `INSERT INTO users (
       `,
      []);
    return result.rows[0];
  }






}

module.exports = User;
