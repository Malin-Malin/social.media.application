import { isLoggedIn, logoutUser } from "../api/authService.js";

// Breadcrumb 
function displayBreadcrumbs() {
  const breadcrumbList = document.getElementById('breadcrumb-list');
  if (!breadcrumbList) return;

  const breadcrumbMap = {
    '/': ['Home'],
    '/index.html': ['Home'],
    '/account/profilePage.html': ['Home', 'Profile'],
    '/account/editProfilePage.html': ['Home', 'Profile', 'Edit'],
    '/account/login.html': ['Home', 'Login'],
    '/post/feed.html': ['Home', 'Feed'],
    '/post/createPost.html': ['Home', 'Feed', 'Create Post'],
    '/post/post.html': ['Home', 'Feed', 'Post'],
    '/account/viewProfile.html': ['Home', 'Profile'],
  };

  // Get current path
  let path = window.location.pathname;
  // Remove trailing slash if present
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  const crumbs = breadcrumbMap[path] || ['Home'];

  // Build breadcrumb HTML
  let html = '';
  crumbs.forEach(function(crumb, idx) {
    if (idx === 0) {
      html += `<li class="breadcrumb-item"><a href="/index.html">Home</a></li>`;
    } else if (idx === crumbs.length - 1) {
      html += `<li class="breadcrumb-item active" aria-current="page">${crumb}</li>`;
    } else {
      // Intermediate crumbs
      let link = '/';
      if (crumb === 'Profile') link = '/account/profilePage.html';
      if (crumb === 'Feed') link = '/post/feed.html';
      html += `<li class="breadcrumb-item"><a href="${link}">${crumb}</a></li>`;
    }
  });
  breadcrumbList.innerHTML = html;
};

//   Headers
fetch('/components/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('main-header').innerHTML = data;
    displayBreadcrumbs();

    const loginLink = document.getElementById("login-link");
    const profileDropdown = document.getElementById("profile-dropdown");
    if (!isLoggedIn()) {
      profileDropdown.classList.add("d-none");
      loginLink.classList.remove("d-none");
    } else {
      profileDropdown.classList.remove("d-none");
        loginLink.classList.add("d-none");
    }
    const signOutElement = document.getElementById("sign-out");
    if (signOutElement) {
      signOutElement.addEventListener("click", function() {
        logoutUser()
        window.location.href = "/index.html";
      });
    }
  })
  .catch(error => console.error('Header load failed:', error));

  //   Footer
fetch('/components/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('main-footer').innerHTML = data;
  })
  .catch(error => console.error('Footer load failed:', error));
