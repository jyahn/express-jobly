/** User class for jobly */

const db = require("../db");
const ExpressError = require("../expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const bcrypt = require("bcrypt");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");


/** User on the site. */

class User {

  /** Add new user */

  static async create({ username, password, first_name, last_name, email, photo_url, is_admin }) {
    const hashedPass = await bcrypt.hash(
      password, BCRYPT_WORK_FACTOR
    );

    const result = await db.query(
      `INSERT INTO users (
        username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
        username,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin`,
        [username, hashedPass, first_name, last_name, email, photo_url, is_admin]
       );
    return result.rows[0];
  }

  
  /** Get all basic info on all users:
   * [{username, first_name, last_name, email, photo_url, is_admin}, ...] */

  static async all() {
    const result = await db.query(
      `SELECT username,
        first_name,
        last_name, 
        email,
        photo_url,
        is_admin
        FROM users`
    );
    return result.rows
  }





}

module.exports = User;
