import { updateProfile, getMyFullProfile } from '../api/profileService.js';
import { isLoggedIn } from '../api/authService.js'; 
const profileForm = document.getElementById('profile-form');
const profile = await getMyFullProfile();


profileForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    // Collect form data
    const formData = new FormData(profileForm);
    const profileData = {
        avatar: {
            url: formData.get('avatar-url'),
            alt: formData.get('avatar-alt')
        },
        banner: {
            url: formData.get('banner-url'),
            alt: formData.get('banner-alt')
        },
        bio: formData.get('bio')
    };
    try {
        await updateProfile(profile.name, profileData);
        // Redirect to view profile page after successful update
        window.location.href = '/account/profilePage.html';
    } catch (error) {
        console.error('Error updating profile:', error);
    }
});

document.getElementById('discard-btn').addEventListener('click', function() {
    window.location.href = '/account/profilePage.html'; // Redirect to profile view page
});

async function loadProfileData() {
    try {
        document.getElementById('avatar-url').value = profile.avatar?.url || '';
        document.getElementById('avatar-alt').value = profile.avatar?.alt || '';
        document.getElementById('banner-url').value = profile.banner?.url || '';
        document.getElementById('banner-alt').value = profile.banner?.alt || '';
        document.getElementById('bio').value = profile.bio || '';
        document.getElementById('username').textContent = profile.name || 'No Name';
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}



async function main() {
    if (!isLoggedIn()) {
        window.location.href = '/account/login.html';
        return;
    }
    loadProfileData();
}

main();