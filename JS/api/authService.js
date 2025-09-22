 // Handles login, register, etc.
import {save, remove, load} from '../storage/storageService.js';
import {post} from './apiClient.js';

const LOGIN_ENDPOINT = '/auth/login';
const REGISTER_ENDPOINT = '/auth/register';

/**
 * Register a user
 * @param {string} name - The users name.
 * @param {string} username The users email.
 * @param {string} password The users password.
 * @returns {Promise<object>} The newly created user profile.
 * 
 */
export async function registerUser(name, username, password) {
    const userData = {
        name: name,
        email: username,
        password: password,
    }
    try {
        const response = await post(REGISTER_ENDPOINT, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
    /*
    finally - turn of loadingspinner?!
    */
}

/**
 * Logs in a user.
 * @param {string} username The users email.
 * @param {string} password The users password.
 * @returns {Promise<object>} The user profile data.
 */
export async function loginUser(username, password) {
    const credentials = {
        email: username,
        password: password,
    } 
    try {
        const response = await post(LOGIN_ENDPOINT, credentials);
        const { accessToken, ...profile } = response.data;

        if (accessToken) {
            save('accessToken', accessToken);
            save('profile', JSON.stringify(profile));
            return profile;
        } else {
            throw new Error('Login successful, but no access token received.');
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Logs out the user by clearing saved data.
 */
export function logoutUser() {
  remove('accessToken');
  remove('profile');
}


/**
 * Checks if the user is currently logged in.
 * @returns {boolean}
 */
export function isLoggedIn() {
  return !!localStorage.getItem('accessToken');
}

/**
 * Gets the current user's profile from localStorage.
 * @returns {object|null}
 */
export function getUserProfile() {
  return load('profile',true);
}
