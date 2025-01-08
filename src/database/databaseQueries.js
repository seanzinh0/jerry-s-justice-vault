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
         const [rows] = await connection.query(`SELECT * FROM users`)
         return rows;
    } catch (e) {
        console.error('Error fetching user:', e);
    } finally {
        connection.release();
    }
};

async function insertUserData(username, firstName, lastName, email, password) {
        const connection = await pool.getConnection()
        try {
            const [rows] = await connection.query("INSERT INTO `jjv`.`users` (`username`, `firstName`, `lastName`, `email`, `password`) VALUES" +  "(" + "'" + username + "'" + ", " + "'" + firstName + "'" + ", " + "'" + lastName + "'" + ", " + "'" + email + "'" + ", " + "'" + password + "'" + ")")
            return 'Registration successful!'
        } catch (e) {
            console.error('Error inserting user:', e);
        } finally {
            connection.release();
        }
    
}


async function getUserId(username, password) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT id, password
            FROM users
            WHERE username = ?
              AND password = ?
        `, [username, password]);

        // Check if a user was found
        if (rows.length > 0) {
            return { id: rows[0].id };
        } else {
            throw new Error('No user found with the provided info.')
        }
    } catch (e) {
        console.error('Error getting user ID: ', e);
        throw e;
    } finally {
        connection.release();
    }
}

async function getAccountInfoById(id) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
        SELECT username, firstName, lastName, email
        FROM users
        WHERE id = ?`, [id]);
        return rows[0];
    } catch (e) {
        console.error('Error finding account information: ', e);
        throw e;
    } finally {
        connection.release();
    }
}

module.exports =  {
    fetchUserData,
    insertUserData,
    getUserId,
    getAccountInfoById
};
