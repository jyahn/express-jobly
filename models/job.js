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



  static async get(search, min_salary, min_equity) {

    let arr = [];
    let arrForSql = [];
    let count = 1

    if (search !== undefined) {
      arr.push(`lower(title) LIKE '%' || $${count} || '%'`)
      arrForSql.push(search);
      count++;
    }
    if (min_salary !== undefined) {
      arr.push(`salary >= $${count}`)
      arrForSql.push(Number(min_salary));
      count++;
    }
    if (min_equity !== undefined) {
      arr.push(`equity <= $${count}`)
      arrForSql.push(Number(min_equity));
    }

    if (arr.length > 0) {
      const result = await db.query(
        `SELECT title, company_handle from jobs WHERE ${arr.join(" AND ")}`,
        arrForSql);
      return result.rows;
    } else {
      const result = await db.query(
        `SELECT title, company_handle from jobs`);
      return result.rows;
    }
  }

  /** Search for job by id */

  static async getById(id) {
    const result = await db.query(
      `SELECT j.id,
      j.title,
      j.salary,
      j.equity,j.company_handle,
      c.handle,
      c.name,
      c.num_employees,
      c.description,
      c.logo_url
      FROM jobs as j
        JOIN companies as c ON c.handle = j.company_handle
      WHERE j.id = $1`,
      [id]);
    let m = result.rows[0];
    return {
      id: m.id,
      title: m.title,
      salary: m.salary,
      equity: m.equity,
      company: {
        handle: m.company_handle,
        name: m.name,
        num_employees: m.num_employees,
        description: m.description,
        logo_url: m.logo_url
      }
    }
  }


  /** Update company with data provided */

  static async update(id, data) {

    let items = {}
    for (var key in data) {
      if (data[key] !== undefined) {
        items[key] = data[key];
      }
    }
    let sqlObj = sqlForPartialUpdate("jobs", items, "id", id)
    const result = await db.query(
      `${sqlObj.query}`, sqlObj.values);
    if (result.rows.length === 0) {
      throw { message: `There is no job with id of'${id}`, status: 404 }
    }
    return result.rows[0];
  }



  /** Delete job by id */

  static async delete(id) {
    const result = await db.query(
      `DELETE FROM jobs 
      WHERE id = $1`,
      [id]);
  }

}

module.exports = Job;