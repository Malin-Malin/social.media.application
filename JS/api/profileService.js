
import {get, post, put, del} from './apiClient.js';
import { getUserProfile } from './authService.js';

const PROFILES_ENDPOINT = '/social/profiles'; //all profiles
const FOLLOW_SUBENDPOINT = '/follow'; //follow
const UNFOLLOW_SUBENDPOINT = '/unfollow'; //unfollow
const SEARCH_ENDPOINT = '/social/profiles/search?q='; //search



//-----------------------------------------------single profile----------------------------
// get by id 

export async function getProfile(name, following = false, followers = false, posts = false) {
  const profile = await get(`${PROFILES_ENDPOINT}/${name}?following=${following}&followers=${followers}&posts=${posts}`);
  return profile;
}


//-----------------------------------------------all profiles----------------------------

export async function getAllProfiles({ page = 1, limit = 9 } = {}) {
  const profiles = await get(`${PROFILES_ENDPOINT}?limit=${limit}&page=${page}`); 
  return profiles;
}

export async function getMyFullProfile(){
  const userName = getUserProfile().name;
  const myProfile = getProfile(userName, true, true);
  save('profile', JSON.stringify(myProfile));
  return myProfile;
}

//----------------------------------------------all posts by profile----------------------------
// get
// The response is the same as the posts endpoint, and accepts the same optional query parameters and flags

export async function getAllPostsByProfile(name) {
  const posts = await get(`${PROFILES_ENDPOINT}/${name}/posts`);  
  return posts;
} 

//-----------------------------------------------update profile----------------------------
// put
//this is not requierd

//-----------------------------------------------follow profile----------------------------

export async function followProfile(profileName) {
  const response = await put(`${PROFILES_ENDPOINT}/${profileName}${FOLLOW_SUBENDPOINT}`);
  return response.following;
}

// TODO: I should put the list into something- how else can I see it? 



//-----------------------------------------------unfollow profile----------------------------

export async function unfollowProfile(profileName) {
  const response = await put(`${PROFILES_ENDPOINT}/${profileName}${UNFOLLOW_SUBENDPOINT}`);
  return response.following;
}

export function isFollower(profileName) {
  const followers = getUserProfile().followers || [];
  return followers.some(f => (f?.name || "").toLowerCase() === (profileName || "").toLowerCase());
}

export function isFollowing(profileName) {
  const follows = getUserProfile().following || [];
  return follows.some(f => (f?.name || "").toLowerCase() === (profileName || "").toLowerCase());
}


// ------------------------------serach profiles---------------------------------------------

export async function searchProfiles(query) {
  const profiles = await get(`${SEARCH_ENDPOINT}${query}`);  
  return profiles;
}



// ------------------------------------------------------------------

// app.js
import { getAllProfiles, searchProfiles } from "./api/profiles.js";

const listEl = document.querySelector("#profiles");
const pageInfo = document.querySelector("#pageInfo");
const btnPrev = document.querySelector("#prev");
const btnNext = document.querySelector("#next");
const form = document.querySelector("#searchForm");
const qInput = document.querySelector("#q");

let page = 1;
let limit = 12;
let currentQuery = "";

init();

async function init() {
  // Ensure you’ve already set localStorage accessToken + apiKey after login/api-key creation.
  await load();
}

async function load() {
  listEl.innerHTML = "<p>Loading…</p>";

  try {
    const json = currentQuery
      ? await searchProfiles(currentQuery)            // search endpoint is not paginated; keep it simple for now
      : await getAllProfiles({ page, limit });        // paginated

    const items = json.data || [];
    const meta = json.meta || {};

    listEl.innerHTML = items.map(renderCard).join("");

    if (currentQuery) {
      pageInfo.textContent = `Results: ${items.length}`;
      btnPrev.disabled = true;
      btnNext.disabled = true;
    } else {
      pageInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount || 1}`;
      btnPrev.disabled = !!meta.isFirstPage;
      btnNext.disabled = !!meta.isLastPage;
    }
  } catch (err) {
    listEl.innerHTML = `<p style="color:crimson">Failed: ${err.message}</p>`;
  }
}

function renderCard(p) {
  const avatar = p.avatar?.url || "https://placehold.co/400x240?text=No+Avatar";
  const name = p.name || "(no name)";
  const bio = p.bio || "";
  const posts = p._count?.posts ?? 0;
  const followers = p._count?.followers ?? 0;
  return `
    <article class="card">
      <img src="${avatar}" alt="${p.avatar?.alt || name}" />
      <h3>${name}</h3>
      <p>${bio}</p>
      <small>Posts: ${posts} · Followers: ${followers}</small>
    </article>
  `;
}

btnPrev.addEventListener("click", () => { if (page > 1) { page--; load(); } });
btnNext.addEventListener("click", () => { page++; load(); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentQuery = qInput.value.trim();
  page = 1;
  load();
});



// pagination
//default if empty banner/ profile image 