const path = require('path');
const express = require('express');
const hbs = require('hbs');
const courtListener = require('./utils/courtlistener');
const {insertUserData} = require('./database/databaseQueries');
const {fetchUserData} = require('./database/databaseQueries');
const {getUserId} = require('./database/databaseQueries');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set("views", viewPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

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
    if(!req.query.username && !req.query.password) {
        return res.send({
            error: "Please provide a username and password to login"
        })
    }
    getUserId(req.query.username, req.query.password).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(401).send({
            err: 'Invalid username or password'
        })
    })

})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/api/register', (req, res) => {
    console.log("Receive request");
 if(!req.query.username && !req.query.firstName && !req.query.lastName && !req.query.email &&  !req.query.password ) {
     return res.send({
         error: "You must provide a value for a user"
     })
 }
 insertUserData(req.query.username, req.query.firstName, req.query.lastName, req.query.email, req.query.password).then(result => {
     res.send(result)
 });
})

app.get('/account', (req, res) => {
    res.render('account');
})

app.get('/api/account', (req, res) => {

})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})