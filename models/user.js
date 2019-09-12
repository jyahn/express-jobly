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


  static async getByHandle(username) {
    const result = await db.query(
      `SELECT username,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin
      from users WHERE username = $1`,
      [username]);

    return result.rows[0];

  }


  /** Update company with data provided */

  static async update(username, data) {

    let items = {}
    for (var key in data) {
      if (data[key] !== undefined) {
        items[key] = data[key];
      }
    }
    let sqlObj = sqlForPartialUpdate("users", items, "username", username)
    const result = await db.query(
      `${sqlObj.query}`, sqlObj.values);
    if (result.rows.length === 0) {
      throw { message: `There is no User with username of'${username}`, status: 404 }
    }
    return result.rows[0];
  }


  static async delete(username) {
    const result = await db.query(
      `DELETE FROM users 
      WHERE username 
      LIKE $1`,
      [username]);
  }


}

module.exports = User;
