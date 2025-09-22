document.getElementById("edit-profile-btn").addEventListener("click", function() {
  window.location.href = "/account/editProfilePage.html";
});

// Do I keep this? 

// Example: Fetch user profile and update DOM
document.addEventListener('DOMContentLoaded', function() {
    // Replace this with your actual fetch logic
    const user = getUserProfile(); // e.g., from API or localStorage

    document.getElementById('avatar').src = user.avatarUrl;
    document.getElementById('username').textContent = user.username;
    document.getElementById('bio').textContent = user.bio;
});

    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const bio = document.getElementById('bio').value;
        const avatarUrl = document.getElementById('avatarUrl').value;
        // Save to localStorage (replace with API call if needed)
        localStorage.setItem('userProfile', JSON.stringify({ username, bio, avatarUrl }));
        window.location.href = '/account/profilePage.html';
    });

    // Doesn't work though