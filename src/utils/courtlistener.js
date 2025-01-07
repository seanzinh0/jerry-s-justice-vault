const request = require('postman-request')

const courtlistener = (lawcase, callback) => {
    const url = `https://www.courtlistener.com/api/rest/v4/search/?q=${encodeURIComponent(lawcase)}`;
    request({url: url, json: true}, (error, {body}) => {
        if (error) {
            callback("Unable to connect to CourtListener", undefined)
        } else if (body.results.length === 0) {
            callback("No cases found", undefined)
        }
        callback(undefined, {
            attorney: body.results.attorney,
            caseName: body.results.caseName,
            court: body.results.court,
            dateFiled: body.results.dateFiled,
            doc: body.results.opinions[2],
            snippet: body.results.opinions[9]
        })
    })
}

module.exports = courtlistener;