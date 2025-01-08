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

//for get api/account route
async function getLoggedInUser() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`TRUNCATE TABLE loggedInUser`);     // Ensure only one logged-in user
        await insertLoggedInUser()                                //  Insert logged-in user's id into loggedIn table

        const [rows] = await connection.query(`
            SELECT id, username, firstName, lastName, email
            FROM loggedInUser
            INNER JOIN user
            USING(id)
            LIMIT 1;
        `)
        return rows;
    } catch (e) {
        console.error('Error getting logged in user:', e);
    } finally {
        connection.release();
    }

}

//for getLoggedInUser function
async function insertLoggedInUserId() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
          INSERT INTO loggedInUser
            SELECT id
            FROM user
        `)
    } catch (e) {
        console.log('Error inserting logged in user:', e);
    }
}

//for patch api/login route
async function updateUserLogin(username) {
    const connection = await pool.getConnection();
    try {
        //after the patch is updating the loggedIn property on the json
        await connection.query(`
            UPDATE user
            SET loggedIn = true
            WHERE username = ${username}
        `)
    } catch (e) {
        console.log('Error updating a user to logged in:', e);
    }
}


async function insertUserData(username, firstName, lastName, email, password) {
        const connection = await pool.getConnection()
        try {
            const [rows] = await connection.query("INSERT INTO `jjv`.`users` (`username`, `firstName`, `lastName`, `email`, `password`) VALUES" +  "(" + "'" + username + "'" + ", " + "'" + firstName + "'" + ", " + "'" + lastName + "'" + ", " + "'" + email + "'" + ", " + "'" + password + "'" + ")")
            return rows;
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
            return rows[0].id;
        } else {
            return new Error('No user found with the provided info.')
        }
    } catch (e) {
        console.error('Error getting user ID: ', e);
        throw e;
    } finally {
        connection.release();
    }
}



 async function checkUserExistWhenLogin(username, email) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query(`
            SELECT username, email
            FROM users
            WHERE username = ?
             AND email = ?
        `, [username, email])

         if(rows) {
            return 'You already have an account, please use log in instead.'
         } 
    } catch (e) {
        console.error('Error checking if the user exist:', e);
    } finally {
        connection.release();
    }
 }

module.exports =  {
    fetchUserData,
    insertUserData,
    getUserId,
    checkUserExistWhenLogin,
};
