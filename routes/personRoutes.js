const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const fs = require("fs");
const readline = require("readline");
 
const client = require("../db_connection");

const isLoggedIn = (req, res, next) => {
    const authToken = req.cookies.authToken;
    if (!authToken) {
      return res.status(401).send({error: "Unauthorized"});
    }
  
    // Verify the authenticity of the token
    try {
      const user = jwt.verify(authToken, "1234");
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).send({error: "Unauthorized"});
    }
};

let ip;
let userName;

app.use(function (req, res, next) {
    ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    next();
});

function checkDiff(oldData, newData) {
    const diff = {};
    for (const key in oldData) {
        if ((oldData[key]) !== String(newData[key])) {
            diff[key] = [oldData[key], newData[key]];
        }
    }
    return diff;
}

// Log the event to file
function log(eventName, extraData) {

    // Create timestamp
    const timeStamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

    // Parse extraData to JSON and escape commas with backslash
    // {"employee_name":["Tom","Thomas"],"employee_salary":["34534",45343],"employee_age":["54",45]} 
    extraData = JSON.stringify(extraData).replace(/{/g, '').replace(/}/g, '').replace(/:/g, '\\').replace(/,/g, ' | ').replace(/"/g, '');

    // Write to file
    fs.appendFile('log.txt', timeStamp + ',' + ip + ',' + userName + ',' + eventName + ',' + extraData + ' \r\n', function (err) {
        if (err) throw err;
    });
}

app.post("/login", async (req, res) => {
    const sql = "SELECT * FROM users WHERE username = $1";
    const values = [req.body.user];
    client.query(sql, values, function (err, result) {
      if (err) throw err;
      if (result.rows.length > 0) {
        const token = jwt.sign({id: result.rows[0].id, user: result.rows[0].username}, "1234");
        res.cookie("authToken", token, {httpOnly: true});
        res.send({data: result.rows, status: "success", message: "Successfully! User has been logged in."});
      } else {
        res.send({data: [], status: "error", message: "Invalid user"});
      }
    });
});

app.post("/logout", (req, res) => {
    res.clearCookie("authToken", {expires: new Date(0)});
    res.send({message: "Logged out successfully"});
});
  

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
    res.status(201).send({data: result.rows, status: "success", message: "Successfully! Record has been added."});
    });
});

app.put("/:id", isLoggedIn, async (req, res) => {
    userName = req.user.id;
    let diff;

    const sqlOld = `SELECT * FROM workers WHERE id = $1`;
    const valuesOld = [req.params.id];
    client.query(sqlOld, valuesOld, function (err, oldResult) {
    if (err) throw err;
    diff = checkDiff(req.body, oldResult.rows[0]);
    });

    const sql = `UPDATE workers SET employee_name = $1, employee_salary = $2, employee_age = $3, profile_image = $4 WHERE id = $5 RETURNING *`;
    const values = [req.body.employee_name, req.body.employee_salary, req.body.employee_age, '', req.params.id];
    client.query(sql, values, function (err, result) {
    if (err) throw err;
    res.send({data: result.rows, status: "success", message: "Successfully! Record has been updated."});

    log('PUT', diff);
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