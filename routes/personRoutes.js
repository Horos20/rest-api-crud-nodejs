const express = require("express");
const app = express();
 
const client = require("../db_connection");

app.get("/", async (req, res) => {
    const sql = "SELECT * FROM workers"
    client.query(sql, function (err, result) {
      if (err) throw err;
      res.send({data: result.rows, status: "success", message: "Successfully! All records has been fetched."});
    });
});

app.post("/", async (req, res) => {
    const sql = `INSERT INTO workers (employee_name, employee_salary, employee_age, profile_image) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [req.body.employee_name, req.body.employee_salary, req.body.employee_age, ""];
    client.query(sql, values, function (err, result) {
    if (err) throw err;
    res.send({data: result.rows, status: "success", message: "Successfully! Record has been added."});
    });
});

app.put("/:id", async (req, res) => {
    const sql = `UPDATE workers SET employee_name = $1, employee_salary = $2, employee_age = $3, profile_image = $4 WHERE id = $5 RETURNING *`;
    const values = [req.body.employee_name, req.body.employee_salary, req.body.employee_age, '', req.params.id];
    client.query(sql, values, function (err, result) {
    if (err) throw err;
    res.send({data: result.rows, status: "success", message: "Successfully! Record has been updated."});
    });
});

app.delete("/:id", async (req, res) => {
    const sql = `DELETE FROM workers WHERE id = $1`;
    const values = [req.params.id];
    client.query(sql, values, function (err, result) {
    if (err) throw err;
    res.send({data: result.rows.id, status: "success", message: "Successfully! Record has been deleted."});
    });
});

module.exports = app;