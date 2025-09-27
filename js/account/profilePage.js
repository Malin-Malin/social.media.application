import { getMyFullProfile } from "../api/profileService.js";
import { isLoggedIn, logoutUser } from "../api/authService.js";

const postsBtn = document.getElementById('posts-btn');
const followersMatrix = document.getElementById('followers-matrix');
const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', function() {
  logoutUser();
  window.location.href = '/';
});

document.getElementById("edit-profile-btn").addEventListener("click", function() {
  window.location.href = "/account/editProfilePage.html";
});

async function displayFollowers(followers) {
  followersMatrix.innerHTML = '';

  followers.forEach(follower => {
    const followerCard = document.createElement('div');
    followerCard.className = 'col-12 col-md-4 py-4 text-center';
    followerCard.innerHTML = `
      <img alt="${follower.name}" class="rounded-circle mb-3" src="${follower.avatar?.url || 'https://i.pravatar.cc/400?img=11'}" 
          width="96" height="96">
      <h5><strong>${follower.name || '(no name)'}</strong></h5>
      <p class="mt-2">${follower.bio || ''}</p>
      <div style="margin-top:.5rem;">
        <a href="/account/viewProfile.html?u=${encodeURIComponent(follower.name)}">View profile →</a>
      </div>
    `;

    followersMatrix.appendChild(followerCard);
  });
}

async function displayProfile() {
  const user = await getMyFullProfile();
  document.getElementById('avatar').src = user.avatar?.url || '/image/avatar.jpg';
  document.getElementById('username').textContent = user.name || 'No Name';
  document.getElementById('bio').innerText = user.bio || 'No bio available';
  document.getElementById('followers-count').textContent = user._count.followers ? user._count.followers : '0';
  document.getElementById('following-count').textContent = user._count.following ? user._count.following : '0';
  document.getElementById('post-count').textContent = user._count.posts ? user._count.posts : '0';
  
  displayFollowers(user.followers);
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
  if (!isLoggedIn()) {
    window.location.href = '/account/login.html';
    return;
  }
  try {
      await displayProfile();
  } catch (error) {
      window.location.href = '/404.html'
  }
} 
main();