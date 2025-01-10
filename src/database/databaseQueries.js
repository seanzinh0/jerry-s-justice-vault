const pool = require('./connectionPool.js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encryptID(id) {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypt = cipher.update(id.toString(), 'utf8', 'hex');
    encrypt += cipher.final('hex');
    return encrypt;
}

function decryptID(id) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decrypt = decipher.update(id.toString(), 'hex', 'utf8');
    decrypt += decipher.final('utf8');
    return decrypt;
}

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
        const connection = await pool.getConnection();
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const [existingUser] = await connection.query(`
                SELECT id
                FROM users
                WHERE username = ? OR email = ?;
            `, [username, email]);
            if (existingUser.length > 0) {
                return 'Username or email already exists';
            }
            const [rows] = await connection.query('INSERT INTO `JJV`.`users` (`username`, `firstName`, `lastName`, `email`, `password`) VALUES (?, ?, ?, ?, ?);', [username, firstName, lastName, email, hashedPassword]);
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
            WHERE username = ?;
        `, [username]);

        // Check if a user was found
        if (rows.length > 0) {
            const isValidPassword = await bcrypt.compare(password, rows[0].password);
            if(isValidPassword) {
                const encryptedID = encryptID(rows[0].id);
                return { id: encryptedID };
            } else {
                return 'Invalid password';
            }
        } else {
            return 'Invalid username or password'
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
        const decryptedID = decryptID(id)
        const [rows] = await connection.query(`
        SELECT username, firstName, lastName, email
        FROM users
        WHERE id = ?`, [decryptedID]);
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
