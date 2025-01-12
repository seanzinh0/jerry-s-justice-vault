const path = require('path');
const express = require('express');
const hbs = require('hbs');
const courtListener = require('./utils/courtlistener');
const {insertUserData, displayLegalCases} = require('./database/databaseQueries');
const {getUserId} = require('./database/databaseQueries');
const {getAccountInfoById} = require('./database/databaseQueries');
const {insertLegalCase} = require('./database/databaseQueries');
const {displayLegalCase} = require('./database/databaseQueries');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set("views", viewPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(express.json());

app.get('', (req, res) => {
    res.render('index');
})

app.get('/search', (req, res) => {
    res.render('search');
})

app.get('/api/search', (req, res) => {
    if(!req.query.lawCase) {
        return res.send({
            error: "You must provide a case"
        })
    }
    courtListener(req.query.lawCase, (error, results) => {
        if (error) {
            return res.send({error})
        }
        res.send({
            results: results
        })
    });
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/api/login', (req, res) => {
    if(!req.body.username && !req.body.password) {
        return res.send({
            error: "Please provide a username and password to login"
        })
    }
    getUserId(req.body.username, req.body.password).then(result => {
        res.send(result);
    });
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/api/register', (req, res) => {
    console.log("Receive request");
 if(!req.body.username && !req.body.firstName && !req.body.lastName && !req.body.email &&  !req.body.password ) {
     return res.send({
         error: "You must provide a value for a user"
     })
 }
 insertUserData(req.body.username, req.body.firstName, req.body.lastName, req.body.email, req.body.password).then(result => {
     res.send(result)
 });
})

app.get('/account', (req, res) => {
    res.render('account');
})

app.get('/api/account', (req, res) => {
    if(!req.query.id){
        return res.send({
            error: "You are not logged in"
        })
    }
    getAccountInfoById(req.query.id).then(result => {
        res.send(result)
    })
})

app.post('/api/insertLegalCase', (req, res) => {
    const { userID, attorney, caseName, court, dateFiled, doc, snippet } = req.body;
    insertLegalCase(userID, attorney, caseName, court, dateFiled, doc, snippet).then(result => {
        res.send(result)
    })
})

app.get('/api/cases', (req, res) => {
    displayLegalCases(req.query.id).then(result => {
        res.send(result)
    })
})

app.get('*', (req, res) => {
    res.render('404');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})