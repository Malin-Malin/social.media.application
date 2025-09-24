
import {get, post, put, del} from './apiClient.js';
import { getUserProfile } from './authService.js';
import { save } from '../storage/storageService.js';

const PROFILES_ENDPOINT = '/social/profiles'; //all profiles
const FOLLOW_SUBENDPOINT = '/follow'; //follow
const UNFOLLOW_SUBENDPOINT = '/unfollow'; //unfollow
const SEARCH_ENDPOINT = '/social/profiles/search?q='; //search



//-----------------------------------------------single profile----------------------------
// get by id 

export async function getProfile(name, following = false, followers = false, posts = false) {
  const profile = await get(`${PROFILES_ENDPOINT}/${name}?_following=${following}&_followers=${followers}&_posts=${posts}`);
  return profile.data;
}


//-----------------------------------------------all profiles----------------------------

export async function getAllProfiles({ page = 1, limit = 9 } = {}) {
  const profiles = await get(`${PROFILES_ENDPOINT}?limit=${limit}&page=${page}`); 
  return profiles;
}

export async function getMyFullProfile(){
  const user = await getUserProfile();
  //THIS SHOULD WORK, JS is broken and weird
  // console.log(user.name);
  const myProfile = await getProfile(user.name, true, true);
  if (myProfile) save('profile', JSON.stringify(myProfile));
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
export async function updateProfile(profileName, profileData) {
  const updatedProfile = await put(`${PROFILES_ENDPOINT}/${profileName}`, profileData);  
  await getMyFullProfile(); //update my profile in local storage
  return updatedProfile;
}

//-----------------------------------------------follow profile----------------------------

export async function followProfile(profileName) {
  const response = await put(`${PROFILES_ENDPOINT}/${profileName}${FOLLOW_SUBENDPOINT}`);
  await getMyFullProfile(); //update my profile in local storage  
  return response.following;
}

// TODO: I should put the list into something- how else can I see it? 



//-----------------------------------------------unfollow profile----------------------------

export async function unfollowProfile(profileName) {
  const response = await put(`${PROFILES_ENDPOINT}/${profileName}${UNFOLLOW_SUBENDPOINT}`);
  await getMyFullProfile(); //update my profile in local storage  
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