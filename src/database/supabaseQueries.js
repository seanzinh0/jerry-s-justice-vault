
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

/**
 * Fetch user data from 'users' table.
 * @param {string} [neededData='*'] - Column to fetch ('id', 'first_name', etc.). Default is all fields.
 * @returns {Promise<object>} - User data.
 * 
 * @example
 * fetchUser(); // Fetches all users data
 * fetchUser('first_name'); // Fetches only the first names
 */
async function fetchUserData(neededData = '*') {
    switch(neededData) {
        case 'id': {
            neededData = 'id'
            break;
        }
        case 'first_name': {
            neededData = 'first_name'
            break;
        }
        case 'last_name': {
            neededData = 'last_name'
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
    try {
        const { users, error } = await supabase
         .from('users')
         .select(neededData)

         if(error) {
            throw new Error(error.message);
         }
         return users;
    } catch (e) {
        console.error('Error fetching user:', e);
    }
};


/**
 * Fetch case data from 'cases' table.
 * @param {string} [neededData='*'] - Column to fetch('case_name', 'case_date', etc.). Default is all fields.
 * @returns {Promise<object>} - Case data.
 * 
 * @example
 * fetchCase(); // Fetches all cases data
 * fetchCase('case_name'); // Fetches only the case names
 */
async function fetchCaseData(neededData = '*') {
    switch(neededData) {
        case 'id': {
            neededData = 'id'
            break;
        }
        case 'case_name': {
            neededData = 'case_name'
            break;
        }
        case 'case_date': {
            neededData = 'case_date'
            break;
        }
        case 'case_nature': {
            neededData = 'case_nature'
            break;
        }
        case 'case_location': {
            neededData = 'case_location'
            break;
        }
        case 'case_opinion': {
            neededData = 'case_opinion'
            break;
        }
        default: 
            neededData = '*';
            break;
    }
    try {
        const { cases, error } = await supabase
         .from('cases')
         .select(neededData)

         if(error) {
            throw new Error(error.message);
         }

         return cases;
    } catch (e) {
        console.error('Error fetching case(s):', e);
    }
};

/**
 * Insert user data into the 'users' table.
 * 
 * @param {string} column - The column to insert the value into (e.g., 'username', 'email').
 * @param {string|number} value - The value to insert into the specified column.
 * @returns {Promise<object>} - The inserted data returned by Supabase.
 * 
 * @example
 * insertUserData('username', 'john_doe'); // Inserts a username into the 'users' table.
 * insertUserData('email', 'john.doe@example.com'); // Inserts an email into the 'users' table.
 */
async function insertUserData(column, value) {
    try {
        const { insertedUser, error } = await supabase
          .from('users')
          .insert([
            { [column]: value } 
          ]);

        if (error) {
            throw new Error(error.message);
        }

        return insertedUser; 
    } catch (e) {
        console.error('Error inserting user:', e);
    }
};


/**
 * Fetch a specific user's data from the 'users' table based on their username.
 * 
 * @param {string} username - The username of the user to fetch from the 'users' table.
 * @returns {Promise<object>} - The user data for the specified username.
 * 
 * @example
 * fetchSpecificUser('john_doe'); // Fetches the user data for 'john_doe'.
 * fetchSpecificUser('jane_smith'); // Fetches the user data for 'jane_smith'.
 */
async function fetchSpecificUser(username) {
    try {
        const { specificUser, error } = await supabase
         .from('users')
         .select('*')
         .eq('username', username)

         if(error) {
            throw new Error(error.message)
         }

         return specificUser;
    } catch (e) {
        console.error(`Error fetching user: ${username}  with error:`, e);
    }
};


/**
 * Fetch a specific cases's data from the 'cases' table based on their case name.
 * 
 * @param {string} username - The username of the user to fetch from the 'cases' table.
 * @returns {Promise<object>} - The case data for the specified case.
 * 
 * @example
 * fetchSpecificCase('NATIONAL VETERANS LEGAL SERVICES PROGRAM v. United States');
 * fetchSpecificCase('NATIONAL VETERANS LEGAL SERVICES PROGRAM v. United States'); 
 */
async function fetchSpecificCase(caseName) {
    try {
        const { specificCase, error } = await supabase
         .from('users')
         .select('*')
         .eq('case_name', caseName)

         if(error) {
            throw new Error(error.message)
         }

         return specificCase;
    } catch (e) {
        console.error(`Error fetching case: ${caseName}  with error:`, e);
    }
};


module.exports = {
    fetchUserData,
    fetchCaseData,
    insertUserData,
    fetchSpecificUser,
    fetchSpecificCase
}