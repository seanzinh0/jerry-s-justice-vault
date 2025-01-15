// Import all required modules
const pool = require('./connectionPool.js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

// Set secret key and initialization vector using ENV file
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');
const iv = Buffer.from(process.env.IV, 'hex');

// Encrypts user id by using cipher and encrypt
function encryptID(id) {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypt = cipher.update(id.toString(), 'utf8', 'hex');
    encrypt += cipher.final('hex');
    return encrypt;
}

// Decrypts using decipher that uses the same algorithm and returns a decrypted ID
function decryptID(id) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decrypt = decipher.update(id.toString(), 'hex', 'utf8');
    decrypt += decipher.final('utf8');
    return decrypt;
}

// Insert user data function that takes in all required info and inserts into database
async function insertUserData(username, firstName, lastName, email, password) {
    const connection = await pool.getConnection();
    // Hashes password for database security
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        // Checks if username or email is in DB and if it returns errors accordingly
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

        if (existingUserName.length > 0 && existingEmail.length > 0) {
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
        // Query to insert data into DB to register a new user
        const [rows] = await connection.query('INSERT INTO `JJV`.`users` (`username`, `firstName`, `lastName`, `email`, `password`) VALUES (?, ?, ?, ?, ?);', [username, firstName, lastName, email, hashedPassword]);
        return {
            success: true,
            message: "Registration successful!"
        }
    } catch (e) {
        console.error('Error inserting user:', e);
        throw e;
    } finally {
        connection.release();
    }
}

// Login that gets user ID to store in local storage
async function getUserId(username, password) {
    const connection = await pool.getConnection();
    try {
        // Select id and password with username
        const [rows] = await connection.query(`
            SELECT id, password
            FROM users
            WHERE username = ?;
        `, [username]);

        // Check if a user was found
        if (rows.length > 0) {
            // If found decrypt the password
            const isValidPassword = await bcrypt.compare(password, rows[0].password);
            if (isValidPassword) {
                // Return the encrypted ID
                const encryptedID = encryptID(rows[0].id);
                return {id: encryptedID};
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

// Function that gets all account info passing in user ID from local storage
async function getAccountInfoById(id) {
    const connection = await pool.getConnection();
    try {
        // Decrypts the user ID
        const decryptedID = decryptID(id)
        // Gets all user info with ID in query from DB and returns it
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

// Function that inserts a legal case as a bookmark into the DB
async function insertLegalCase(userID, attorney, caseName, court, dateFiled, doc, snippet) {
    const connection = await pool.getConnection();
    try {
        // Decrypts user ID
        const decryptedID = decryptID(userID);
        // Inserts case into DB with the user's ID as a foreign key to reference
        const [rows] = await connection.query('INSERT INTO `JJV`.`legal_cases` (`user_id`, `attorney`, `caseName`, `court`, `dateFiled`, `doc`, `snippet`) VALUES (?, ?, ?, ?, ?, ?, ?);', [decryptedID, attorney, caseName, court, dateFiled, doc, snippet]);
        return 'Case bookmarked'
    } catch (e) {
        console.error('Cannot bookmark case: ', e);
        throw e;
    } finally {
        connection.release();
    }
}

// Displays bookmarks using the user's ID
async function displayLegalCases(id) {
    const connection = await pool.getConnection();
    try {
        // Decrypts user ID and selects all cases where user ID matches
        const decryptedID = decryptID(id)
        const [rows] = await connection.query(`SELECT *
                                               FROM legal_cases
                                               WHERE user_id = ?;`, [decryptedID]);
        return rows;
    } catch (e) {
        console.error('Error getting legal cases: ', e);
        throw e;
    } finally {
        connection.release();
    }
}

// Delete bookmark function that takes in the bookmarks individual ID and deletes in the DB
async function deleteBookMark(bookmarkID) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
            DELETE
            FROM legal_cases
            WHERE id = ?;`, [bookmarkID]);
        return {success: true, message: `Bookmark deleted successfully.`};
    } catch (e) {
        console.error('Error deleting legal cases: ', e);
        throw e;
    } finally {
        connection.release();
    }
}

// Function to update user info
async function updateUser(id, username, firstName, lastName, email) {
    const connection = await pool.getConnection();
    try {
        const decryptedID = decryptID(id);
        const [rows] = await connection.query(`
                    UPDATE users
                    SET username = ?,
                        firstName = ?,
                        lastName = ?,
                        email = ?
                    WHERE id = ?;`,
            [username, firstName, lastName, email, decryptedID]);
        return {success: true, message: `User updated successfully.`};
    } catch (e) {
        console.error('Error updating user: ', e);
        throw e;
    } finally {
        connection.release();
    }
}

// Export functions
module.exports = {
    insertUserData,
    getUserId,
    getAccountInfoById,
    insertLegalCase,
    displayLegalCases,
    deleteBookMark,
    updateUser
};
