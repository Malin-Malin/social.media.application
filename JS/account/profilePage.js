import { getMyFullProfile } from "../api/profileService.js";

document.getElementById("edit-profile-btn").addEventListener("click", function() {
  window.location.href = "/account/editProfilePage.html";
});

// Do I keep this? 

// Example: Fetch user profile and update DOM
document.addEventListener('DOMContentLoaded', async function() {
    // Replace this with your actual fetch logic
    const user = await getMyFullProfile(); // e.g., from API or localStorage
    document.getElementById('avatar').src = user.avatar?.url || '/image/avatar.jpg';
    document.getElementById('username').textContent = user.name || 'No Name';
    document.getElementById('bio').innerText = user.bio || 'No bio available';
    document.getElementById('followers-count').textContent = user._count.followers ? user._count.followers : '0';
    document.getElementById('following-count').textContent = user._count.following ? user._count.following : '0';
    document.getElementById('post-count').textContent = user._count.posts ? user._count.posts : '0';
});

    // document.getElementById('profile-form').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const username = document.getElementById('username').value;
    //     const bio = document.getElementById('bio').value;
    //     const avatarUrl = document.getElementById('avatarUrl').value;
    //     // Save to localStorage (replace with API call if needed)
    //     localStorage.setItem('userProfile', JSON.stringify({ username, bio, avatarUrl }));
    //     window.location.href = '/account/profilePage.html';
    // });

    // Doesn't work though

    // ----------------------------------or this?!-------------------------------

// resultsContainer.innerHTML = '';
// profiles.forEach(profile => {
//   const avatar = profile.avatar?.url || "https://placehold.co/400x240?text=No+Avatar";
//   const name = profile.name || "(no name)";
//   const bio = profile.bio || "";
//   const posts = profile._count?.posts ?? 0;
//   const followers = profile._count?.followers ?? 0;
//   resultsContainer.innerHTML += `
//     <div class="card mb-2">
//       <img src="${avatar}" class="card-img-top" alt="${profile.avatar?.alt || name}">
//       <div class="card-body">
//         <h5 class="card-title">${name}</h5>
//         <p class="card-text">${bio}</p>
//         <small>Posts: ${posts} · Followers: ${followers}</small>
//       </div>
//     </div>
//   `;
// });


