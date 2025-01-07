const path = require('path');
const express = require('express');
const hbs = require('hbs');
const courtListener = require('./utils/courtlistener');

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

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/account', (req, res) => {
    res.render('account');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})