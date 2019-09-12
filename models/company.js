/** Company class for jobly */

const db = require("../db");
const ExpressError = require("../expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


/** Company on the site. */

class Company {

  /** Add new company */

  static async create({ handle, name, num_employees, description, logo_url }) {
    console.log("THIS IS HANDLE-->", handle)
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

  /** Search for company given handle, company name, min_employee, and/or max_employees */

  static async get(search, min_employees, max_employees) {

    let arr = [];
    let arrForSql = [];
    let count = 1

    if (search !== undefined) {
      arr.push(`lower(name) LIKE '%' || $${count} || '%'`)
      arr.push(`lower(name) LIKE '%' || $1 || '%'`)
      arrForSql.push(search);
      count++;
    }
    if (min_employees !== undefined) {
      arr.push(`num_employees >= $${count}`)
      arrForSql.push(Number(min_employees));
      count++;
    }
    if (max_employees !== undefined) {
      arr.push(`num_employees <= $${count}`)
      arrForSql.push(Number(max_employees));
    }

    if (arr.length > 0) {
      const result = await db.query(
        `SELECT * from companies WHERE ${arr.join(" AND ")}`,
        arrForSql);
      return result.rows;
    } else {
      const result = await db.query(
        `SELECT * from companies`);
      return result.rows;
    }
  }

  /** Search for company by handle */

  static async getByHandle(handle) {
    const result = await db.query(
      `SELECT * 
      FROM companies 
      WHERE handle 
      LIKE $1`,
      [handle]);
    return result.rows[0];
  }

  /** Update company with data provided */

  static async update(handle, data) {

    let items = {}
    for (var key in data) {
      if (data[key] !== undefined) {
        items[key] = data[key];
      }
    }
    let sqlObj = sqlForPartialUpdate("companies", items, "handle", handle)
    const result = await db.query(
      `${sqlObj.query}`, sqlObj.values);
    if (result.rows.length === 0) {
      throw { message: `There is no company with handle of'${handle}`, status: 404 }
    }
    return result.rows[0];
  }

  /** Delete company by handle */

  static async delete(handle) {
    const result = await db.query(
      `DELETE FROM companies 
      WHERE handle 
      LIKE $1`,
      [handle]);
  }
}

module.exports = Company;