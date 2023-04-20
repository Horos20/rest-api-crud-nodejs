const express = require("express");
const app = express();
const fs = require("fs");
const readline = require("readline");



app.get('/logs', async (req, res) => {

    // Read the log file
    const lines = [];
    const lineReader = readline.createInterface({
        input: fs.createReadStream('log.txt'),
        crlfDelay: Infinity
    });

    // Parse the log file
    for await (const line of lineReader) {

        // Split the line into array with comma as delimiter, except when comma is escaped with backslash
        const fields = line.match(/(\\.|[^,])+/g)

        // Iterate over result
        for (let i = 0; i < fields.length; i++) {

            // Remove backslash from escaped commas
            fields[i] = fields[i].replace(/\\/g, '');
        }

        // Add the line to the lines array
        lines.push({
            timestamp: fields[0],
            ip: fields[1],
            userName: fields[2],
            eventName: fields[3],
            extraData: fields[4]
        });
    }

    // Return the lines array
    return res.send(lines);

})

module.exports = app