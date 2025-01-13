const pool = require('./connectionPool.js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');
const iv = Buffer.from(process.env.IV, 'hex');

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

//update register functionality
async function insertUserData(username, firstName, lastName, email, password) {
        const connection = await pool.getConnection();
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const [existingUserName] = await connection.query(`
                SELECT id
                FROM users
                WHERE username = ?;
                `, [username]);

            const [existingEmail] = await connection.query(`
                SELECT id
                FROM users
                WHERE email = ?;
                `, [email]);

            if(existingUserName.length > 0 && existingEmail.length > 0) {
                return {
                    error: 'Username and email already exists'
                }
            }

            if (existingUserName.length > 0) {
                return {
                    error: 'Username already exists'
                };
            }

            if (existingEmail.length > 0) {
                return {
                    error: 'Email already exists'
                }
            }

            const [rows] = await connection.query('INSERT INTO `JJV`.`users` (`username`, `firstName`, `lastName`, `email`, `password`) VALUES (?, ?, ?, ?, ?);', [username, firstName, lastName, email, hashedPassword]);
            return {success: true,
            message: "Registration successful!"}
        } catch (e) {
            console.error('Error inserting user:', e);
            throw e;
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
//comment
async function insertLegalCase(userID, attorney, caseName, court, dateFiled, doc, snippet) {
    const connection = await pool.getConnection();
    try {
        const decryptedID = decryptID(userID);
        const [rows] = await connection.query('INSERT INTO `JJV`.`legal_cases` (`user_id`, `attorney`, `caseName`, `court`, `dateFiled`, `doc`, `snippet`) VALUES (?, ?, ?, ?, ?, ?, ?);', [decryptedID, attorney, caseName, court, dateFiled, doc, snippet]);
        return 'Case bookmarked'
    } catch (e) {
        console.error('Cannot bookmark case: ', e);
        throw e;
    }
    finally {
        connection.release();
    }
}

async function displayLegalCases(id) {
    const connection = await pool.getConnection();
    try {
        const decryptedID = decryptID(id)
        const [rows] = await connection.query(`SELECT * FROM legal_cases WHERE user_id = ?;`, [decryptedID]);
        return rows;
    } catch (e) {
        console.error('Error getting legal cases: ', e);
        throw e;
    }
    finally {
        connection.release();
    }
}

async function deleteBookMark(bookmarkID) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
        DELETE FROM legal_cases  WHERE id = ?;`, [bookmarkID]);
        return {success: true, message: `Bookmark deleted successfully.`};
    } catch (e) {
        console.error('Error deleting legal cases: ', e);
        throw e;
    }
    finally {
        connection.release();
    }
}


module.exports =  {
    insertUserData,
    getUserId,
    getAccountInfoById,
    insertLegalCase,
    displayLegalCases,
    deleteBookMark
};
