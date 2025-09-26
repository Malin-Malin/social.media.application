import { getMyFullProfile } from "../api/profileService.js";

const postsBtn = document.getElementById('posts-btn');

document.getElementById("edit-profile-btn").addEventListener("click", function() {
  window.location.href = "/account/editProfilePage.html";
});

// Example: Fetch user profile and update DOM
async function displayProfile() {
  // Replace this with your actual fetch logic
  const user = await getMyFullProfile(); // e.g., from API or localStorage
  document.getElementById('avatar').src = user.avatar?.url || '/image/avatar.jpg';
  document.getElementById('username').textContent = user.name || 'No Name';
  document.getElementById('bio').innerText = user.bio || 'No bio available';
  document.getElementById('followers-count').textContent = user._count.followers ? user._count.followers : '0';
  document.getElementById('following-count').textContent = user._count.following ? user._count.following : '0';
  document.getElementById('post-count').textContent = user._count.posts ? user._count.posts : '0';
}

postsBtn.addEventListener('click', async function() {
  const user = await getMyFullProfile();
  try {
      window.location.href = `/post/feed.html?pn=${user.name}`;
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