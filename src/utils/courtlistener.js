const request = require('postman-request');
require('dotenv').config();

const courtListener = (lawCase, callback) => {
    const url = `https://www.courtlistener.com/api/rest/v4/search/?q=${encodeURIComponent(lawCase)}`;
    request({url: url, json: true, headers: {'Authorization': `Bearer ${process.env.BEARER_TOKEN}`}}, (error, {body}) => {
        if (error) {
            callback("Unable to connect to CourtListener", undefined)
        } else if (body.results.length === 0) {
           return  callback("No cases found", undefined)
        }

        const results = body.results.map(result => {
            const opinions = body.results.opinions || [];
            return {
                attorney: result.attorney,
                caseName: result.caseName,
                court: result.court,
                dateFiled: result.dateFiled,
                doc: opinions[2],
                snippet: opinions[9]
            };
        });
        callback(undefined, results);
    })
}

module.exports = courtListener;