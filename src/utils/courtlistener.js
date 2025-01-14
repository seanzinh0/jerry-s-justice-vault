// Import necessary modules
const request = require('postman-request');
require('dotenv').config();

const courtListener = (lawCase, callback) => {
    // Sets up url for querying searches
    const url = `https://www.courtlistener.com/api/rest/v4/search/?q=${encodeURIComponent(lawCase)}`;
    // Sends the request with the api key to get info from cases
    request({url: url, json: true, headers: {'Authorization': `Bearer ${process.env.BEARER_TOKEN}`}}, (error, {body}) => {
        // Handles errors and returns error messages
        if (error) {
            callback("Unable to connect to CourtListener", undefined)
        } else if (body.results.length === 0) {
           return  callback("No cases found", undefined)
        }

        // Map each result with returning the necessary data in JSON
        const results = body.results.map(result => {
            const opinions = result.opinions || [];
            const downloadUrl = opinions[0].download_url || null;
            const snippet = opinions[0].snippet || null;
            return {
                attorney: result.attorney,
                caseName: result.caseName,
                court: result.court,
                dateFiled: result.dateFiled,
                doc: downloadUrl,
                snippet: snippet
            };
        });
        callback(undefined, results);
    })
}

module.exports = courtListener;