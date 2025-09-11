// SETUP------------------------------------------------------------------

const BASE_URL = "https://v2.api.noroff.dev";

async function apiClient(endpoint, options = {}) {
  const { body, ...customOptions } = options;

  const headers = {
    "Content-Type": "application/json",
  };

  const config = {
    method: body ? "POST" : "GET", // default GET unless body is provided
    ...customOptions,
    headers: {
      ...headers,
      ...customOptions.headers, // allow overrides
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + endpoint, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors?.[0]?.message || "An API error occurred"
      );
    }

    if (response.status === 204) {
      return null; // No content
    }

    return await response.json();
  } catch (error) {
    console.error("API Client Error:", error);
    throw error; // bubble up to caller
  }
}

// Export helpers
export const get = (endpoint) => apiClient(endpoint);
export const post = (endpoint, body) => apiClient(endpoint, { body });
export const put = (endpoint, body) =>
  apiClient(endpoint, { method: "PUT", body });
export const del = (endpoint) => apiClient(endpoint, { method: "DELETE" });


// SETUP------------------------------------------------------------------

import { get } from "./services/apiClient.js";

async function displayUserProfile(id) {
  try {
    const profile = await get(`/social/profiles/${id}`);
    console.log(profile);
  } catch (error) {
    console.error(error.message);
  }
}


// ------------------------------Domain----------------------------------------------

// file: services/gamesService.js
import { get } from "./apiClient.js";

const gamesEndpoint = "/old-games";

export function getAllGames() {
  return get(gamesEndpoint);
}

export function getGameById(id) {
  return get(`${gamesEndpoint}/${id}`);
}

export function getRandomGame() {
  return get(`${gamesEndpoint}/random`);
}


// error------------------------------------

// services/apiClient.js

async function apiClient(endpoint, options = {}) {
  try {
    const response = await fetch(BASE_URL + endpoint, options);

    // Always try to parse JSON
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0]?.message || "An unknown API error occurred.";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("API Client Error:", error);
    throw error;
  }
}

// ---------------------------------------------error class---------------------------

// errors/apiError.js
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}



// ------------------------ smarter UI handeling----------------------------------------

// registrationForm.js
import { registerUser } from "./services/authService.js";
import { ApiError } from "./errors/apiError.js";

async function onRegisterSubmit(formData) {
  try {
    const user = await registerUser(formData);
    console.log("User created:", user);
    // Redirect to login page...
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      alert("This email is already registered. Try logging in instead.");
    } else {
      alert(`Registration failed: ${error.message}`);
    }
  }
}



// --------------------------- auth headers--------------------------------


// services/apiClient.js
import { load } from "../storage/index.js"; // pretend storage helper

const BASE_URL = "https://v2.api.noroff.dev";

async function apiClient(endpoint, options = {}) {
  const { body, ...customOptions } = options;

  const apiKey = load("apiKey");
  const accessToken = load("accessToken");

  const headers = {
    "Content-Type": "application/json",
  };

  if (apiKey) headers["X-Noroff-API-Key"] = apiKey;
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const config = {
    method: body ? "POST" : "GET",
    ...customOptions,
    headers: {
      ...headers,
      ...customOptions.headers,
    },
  };

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(BASE_URL + endpoint, config);
  return response.json();
}


// ------------------------TOKEN------------------------------------------------


// After a successful login
const userData = {
  name: 'testuser',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
};

// Store the token and user profile
localStorage.setItem('accessToken', userData.accessToken);
// We must stringify objects before saving them
localStorage.setItem('profile', JSON.stringify({ name: userData.name }));

// Later, on another page
const token = localStorage.getItem('accessToken');
// We must parse the string back into an object
const profile = JSON.parse(localStorage.getItem('profile'));

console.log(`Welcome back, ${profile.name}!`);

// On logout
localStorage.removeItem('accessToken');
localStorage.removeItem('profile');


// --------------------- token storage-----------------------------------


// After a successful login
const userData = {
  name: 'testuser',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
};

// Store the token and user profile
localStorage.setItem('accessToken', userData.accessToken);
// We must stringify objects before saving them
localStorage.setItem('profile', JSON.stringify({ name: userData.name }));

// Later, on another page
const token = localStorage.getItem('accessToken');
// We must parse the string back into an object
const profile = JSON.parse(localStorage.getItem('profile'));

console.log(`Welcome back, ${profile.name}!`);

// On logout
localStorage.removeItem('accessToken');
localStorage.removeItem('profile');

// -------------------------------Update the API Client--------------------------------------------


// file: services/apiClient.js (updated)

const BASE_URL = 'https://v2.api.noroff.dev';

async function apiClient(endpoint, options = {}) {
  // ... (body and customOptions setup)

  const apiKey = localStorage.getItem('apiKey');
  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-Noroff-API-Key'] = apiKey;
  }

  // --- THIS IS THE NEW PART ---
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  // --- END OF NEW PART ---

  // ... (rest of the fetch logic and error handling)
}


// -----------------------------------create an authenticaator---------------------------------------------------------------



// file: services/authService.js
import { post } from './apiClient.js';

const LOGIN_ENDPOINT = '/auth/login';

/**
 * Logs in a user.
 * @param {object} credentials The user's email and password.
 * @returns {Promise<object>} The user profile data.
 */
export async function loginUser(credentials) {
  try {
    // Our apiClient will handle the POST request
    const response = await post(LOGIN_ENDPOINT, credentials);

    // The response.data from Noroff contains the profile and accessToken
    const { accessToken, ...profile } = response.data;

    if (accessToken) {
      // Save token and profile to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('profile', JSON.stringify(profile));
      return profile;
    } else {
      throw new Error('Login successful, but no access token received.');
    }
  } catch (error) {
    // The apiClient already threw a detailed error, so we just re-throw it
    throw error;
  }
}

/**
 * Logs out the current user by clearing storage.
 */
export function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('profile');
  console.log('User has been logged out.');
}


// -----------------------------------Using the services in UI---------------------------------------------------------------


// In a loginForm.js file
import { loginUser } from './services/authService.js';

const form = document.getElementById('loginForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const credentials = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const profile = await loginUser(credentials);
    alert(`Welcome back, ${profile.name}!`);
    // Redirect to the dashboard or profile page
    // window.location.href = '/dashboard';
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
});

// ----------------------------------------Paginated----------------------------------------------------------


import { get } from './services/apiService.js';

const gamesContainer = document.getElementById('games-container');
const loadMoreButton = document.getElementById('load-more-btn');

// State variable to keep track of the current page
let currentPage = 1;
let isFetching = false;

// Function to fetch a page of games and render them
async function fetchAndRenderGames(page) {
  isFetching = true;
  loadMoreButton.textContent = 'Loading...';
  loadMoreButton.disabled = true;

  try {
    const response = await get(`/old-games?page=${page}&limit=5`);
    const games = response.data;
    const meta = response.meta;

    // Append new games to the container
    games.forEach((game) => {
      const gameElement = document.createElement('div');
      gameElement.textContent = game.name;
      gamesContainer.appendChild(gameElement);
    });

    // Update the button based on the meta data
    if (meta.isLastPage) {
      loadMoreButton.style.display = 'none'; // Hide button if no more pages
    } else {
      loadMoreButton.textContent = 'Load More';
      loadMoreButton.disabled = false;
    }
  } catch (error) {
    console.error('Failed to fetch games:', error);
    loadMoreButton.textContent = 'Failed to load. Try again?';
    loadMoreButton.disabled = false;
  } finally {
    isFetching = false;
  }
}

// Event listener for the button
loadMoreButton.addEventListener('click', () => {
  if (!isFetching) {
    currentPage++; // Increment the page number
    fetchAndRenderGames(currentPage);
  }
});

// Initial load
fetchAndRenderGames(currentPage);


// --------------------------------------------------------------------------------------------------



import { get } from "./services/apiService.js";

const gamesContainer = document.getElementById("games-container");
const pagination = document.getElementById("pagination");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageList = document.getElementById("pageList");

let currentPage = 1;
const LIMIT = 8;
let pageCount = 1; // will be set from meta
let isFetching = false;

function renderGames(games) {
  const frag = document.createDocumentFragment();
  for (const game of games) {
    const el = document.createElement("div");
    el.className = "game-item";
    el.textContent = game.name;
    frag.appendChild(el);
  }
  gamesContainer.innerHTML = ""; // replace content for numbered pagination
  gamesContainer.appendChild(frag);
}

function createPageButton(page, isCurrent = false) {
  const li = document.createElement("li");
  if (page === "...") {
    const span = document.createElement("span");
    span.className = "ellipsis";
    span.textContent = "…";
    li.appendChild(span);
    return li;
  }
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "page-btn";
  btn.textContent = page;
  if (isCurrent) {
    btn.setAttribute("aria-current", "page");
    btn.disabled = true;
  }
  btn.addEventListener("click", () => goToPage(page));
  li.appendChild(btn);
  return li;
}

/**
 * Windowed pagination with ellipses:
 * Always show: 1, last, current, neighbors, and ellipses where needed.
 */
function renderPaginationControls(meta) {
  currentPage = meta.currentPage;
  pageCount = meta.pageCount;

  // Prev/Next enablement
  prevBtn.disabled = meta.isFirstPage;
  nextBtn.disabled = meta.isLastPage;

  // Build page number list
  pageList.innerHTML = "";

  // Helper to push a page or ellipsis
  const items = [];
  const windowSize = 1; // neighbors on each side of current
  const first = 1;
  const last = pageCount;

  const start = Math.max(first, currentPage - windowSize);
  const end = Math.min(last, currentPage + windowSize);

  // Always include first
  items.push(first);

  // Ellipsis after first if gap
  if (start > first + 1) items.push("...");

  // Middle window
  for (let p = start; p <= end; p++) {
    if (p !== first && p !== last) items.push(p);
  }

  // Ellipsis before last if gap
  if (end < last - 1) items.push("...");

  // Always include last (if different from first)
  if (last !== first) items.push(last);

  // Render
  items.forEach((p) => {
    const isCurrent = p === currentPage;
    pageList.appendChild(createPageButton(p, isCurrent));
  });
}

async function fetchPage(page) {
  if (isFetching) return;
  isFetching = true;
  try {
    const { data, meta } = await get("/old-games", { page, limit: LIMIT });
    renderGames(data);
    renderPaginationControls(meta);
  } catch (err) {
    console.error("Failed to fetch page:", err);
  } finally {
    isFetching = false;
  }
}

function goToPage(page) {
  if (typeof page !== "number" || page < 1 || page > pageCount || page === currentPage) return;
  fetchPage(page);
}

prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

// Initial load
fetchPage(currentPage);


// --------------------------------------------------------------------------------------------------



// profileAvatar.js
import { put } from "./services/apiClient.js";

const form = document.getElementById("avatar-update-form");
const img = document.getElementById("profile-pic");

// Replace with the actual profile name to update:
const username = "some_test_user";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form); // collects "avatar" file

  try {
    // Noroff endpoint expects a field named "avatar"
    const res = await put(`/social/profiles/${username}/media`, formData);
    // API returns { data: { avatar: { url: ... } } }
    img.src = res.data.avatar.url;
    alert("Avatar updated!");
  } catch (err) {
    console.error("Failed to update avatar:", err);
    alert(`Upload failed: ${err.message}`);
  }
});



// --------------------------------------------------------------------------------------------------








// --------------------------------------------------------------------------------------------------