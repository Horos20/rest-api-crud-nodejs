const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "horos",
});

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

module.exports = client;
