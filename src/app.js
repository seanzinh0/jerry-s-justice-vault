// Import required modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const courtListener = require('./utils/courtlistener');
const {
    insertUserData,
    getUserId,
    getAccountInfoById,
    insertLegalCase,
    displayLegalCases,
    deleteBookMark,
    updateUser,
} = require('./database/databaseQueries');

// Create backend server with express
const app = express();

// Create paths for public directory, HBS views, and HBS partials
const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup view engine to HBS and register partials
app.set("views", viewPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

// Serve static files from public directory and parse JSON requests
app.use(express.static(publicDirectoryPath));
app.use(express.json());

// Home page route that renders the page
app.get('', (req, res) => {
    res.render('index');
})

// Search page route that renders search page
app.get('/search', (req, res) => {
    res.render('search');
})

// API route for search page that checks for if there is an empty query and gets and returns the data as an object
app.get('/api/search', (req, res) => {
    if (!req.query.lawCase) {
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

// Login route that renders the login page
app.get('/login', (req, res) => {
    res.render('login');
})

// API route for logging in that posts the users credentials and gets the ID if successful
app.post('/api/login', (req, res) => {
    if (!req.body.username && !req.body.password) {
        return res.send({
            error: "Please provide a username and password to login"
        })
    }
    getUserId(req.body.username, req.body.password).then(result => {
        res.send(result);
    });
})

// Register page route that renders the register page
app.get('/register', (req, res) => {
    res.render('register');
})

// API route for register page that validates if req body params are empty return an error and if it isn't post and insert that data to our database
app.post('/api/register', (req, res) => {
    console.log("Receive request");
    const {username, firstName, lastName, email, password} = req.body;
    if (!username && !firstName && !lastName && !email && !password) {
        return res.send({
            error: "You must provide a value for a user"
        })
    }
    insertUserData(username, firstName, lastName, email, password).then(result => {
        res.send(result)
    });
})

// Route for accounts page that renders it
app.get('/account', (req, res) => {
    res.render('account');
})

// API route for account that checks if there is an ID logged in if there is returns the users account info pertaining to that ID
app.get('/api/account', (req, res) => {
    if (!req.query.id) {
        return res.send({
            error: "You are not logged in"
        })
    }
    getAccountInfoById(req.query.id).then(result => {
        res.send(result)
    })
})

// API route for bookmarking a case takes the users ID to associate the bookmark with them and inserts into the legal_cases table in our database
app.post('/api/insertLegalCase', (req, res) => {
    const {userID, attorney, caseName, court, dateFiled, doc, snippet} = req.body;
    insertLegalCase(userID, attorney, caseName, court, dateFiled, doc, snippet).then(result => {
        res.send(result)
    })
})

// API route that displays the users bookmarks based off of their ID
app.get('/api/cases', (req, res) => {
    displayLegalCases(req.query.id).then(result => {
        res.send(result)
    })
})

// API route to delete a bookmark based off the primary key of the individual bookmarks ID
app.delete('/api/deleteBookmark', (req, res) => {
    deleteBookMark(req.query.id).then(result => {
        res.send(result);
    })
})

//Route to update user info
app.put('/api/updateUser', (req, res) => {
    const {id, username, firstName, lastName, email} = req.body;
    updateUser(id, username, firstName, lastName, email).then(result => {
        res.send(result);
    });
})

// Route that displays 404 page if there is not a proper route
app.get('*', (req, res) => {
    res.render('404');
})

//Hosts the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})