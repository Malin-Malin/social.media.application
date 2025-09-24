import { post } from "../api/apiClient.js";
import { getProfile, followProfile, unfollowProfile, isFollowing } from "../api/profileService.js";

// Get the query string from the current URL
const urlParams = new URLSearchParams(window.location.search);

// Get the value of a specific parameter, e.g., "id"
const userName = urlParams.get("u");

const followBtn = document.getElementById('follow-btn');
const unfollowBtn = document.getElementById('unfollow-btn');
const postsBtn = document.getElementById('posts-btn');
// Do I keep this? 

// Example: Fetch user profile and update DOM
async function displayProfile() {
    // Replace this with your actual fetch logic
    const user = await getProfile(userName); // e.g., from API or localStorage
    document.getElementById('avatar').src = user.avatar?.url || '/image/avatar.jpg';
    document.getElementById('username').textContent = user.name || 'No Name';
    document.getElementById('bio').innerText = user.bio || 'No bio available';
    document.getElementById('followers-count').textContent = user._count.followers ? user._count.followers : '0';
    document.getElementById('following-count').textContent = user._count.following ? user._count.following : '0';
    document.getElementById('post-count').textContent = user._count.posts ? user._count.posts : '0';
    if (await isFollowing(userName)) {
        followBtn.classList.add('d-none');
        unfollowBtn.classList.remove('d-none');
    };
};

followBtn.addEventListener('click', async function() {
    try {
        await followProfile(userName);
        followBtn.classList.add('d-none');  
        unfollowBtn.classList.remove('d-none');
        displayProfile();
    } catch (error) {
        console.error("Error following profile:", error);
    }
});

unfollowBtn.addEventListener('click', async function() {
    try {
        await unfollowProfile(userName);
        unfollowBtn.classList.add('d-none');  
        followBtn.classList.remove('d-none');
        displayProfile();
    } catch (error) {
        console.error("Error unfollowing profile:", error);
    }
});

postsBtn.addEventListener('click', async function() {
    try {
        window.location.href = `/post/feed.html?pn=${userName}`;
    } catch (error) {
        console.error("Error navigating to posts:", error);
    }
});

async function main() {
    try {
        await displayProfile();    
    } catch (error) {
        window.location.href = '/404.html'
    }
} 
main();