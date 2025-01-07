const pool = require('./connectionPool.js');

async function fetchUserData(neededData = '*') {
    switch(neededData) {
        case 'id': {
            neededData = 'id'
            break;
        }
        case 'firstName': {
            neededData = 'firstName'
            break;
        }
        case 'lastName': {
            neededData = 'lastName'
            break;
        }
        case 'email': {
            neededData = 'email'
            break;
        }
        case 'username': {
            neededData = 'username'
            break;
        }
        case 'password': {
            neededData = 'password'
            break;
        }
        default: 
            neededData = '*';
            break;
    }

    const connection = await pool.getConnection();
    try {
         const [rows] = await connection.query(`SELECT ${neededData} FROM users`)
         return rows;
    } catch (e) {
        console.error('Error fetching user:', e);
    } finally {
        connection.release();
    }
};

async function insertUserData(username, firstName, lastName, email, password) {
    const connection = await pool.getConnection();
    try {
         const [rows] = await connection.query("INSERT INTO `jjv`.`users` (`username`, `firstName`, `lastName`, `email`, `password`) VALUES" +  "(" + "'" + username + "'" + ", " + "'" + firstName + "'" + ", " + "'" + lastName + "'" + ", " + "'" + email + "'" + ", " + "'" + password + "'" + ")")
         return rows;
    } catch (e) {
        console.error('Error inserting user:', e);
    } finally {
        connection.release();
    }
}

module.exports =  {
    fetchUserData,
    insertUserData
};
