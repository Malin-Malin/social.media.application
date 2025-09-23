// Dynamic breadcrumb generator
// Place a <div id="breadcrumb"></div> where you want the breadcrumb to appear
// and include this script after loading the DOM

document.addEventListener('DOMContentLoaded', function() {
  const breadcrumbList = document.getElementById('breadcrumb-list');
  if (!breadcrumbList) return;

  // Map URL paths to breadcrumb names
  const breadcrumbMap = {
    '/': ['Home'],
    '/index.html': ['Home'],
    '/account/profilePage.html': ['Home', 'Profile'],
    '/account/editProfilePage.html': ['Home', 'Profile', 'Edit'],
    '/account/login.html': ['Home', 'Login'],
    '/post/feed.html': ['Home', 'Feed'],
    '/post/createPost.html': ['Home', 'Feed', 'Create Post'],
    '/post/post.html': ['Home', 'Feed', 'Post'],
    // Add more mappings as needed
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
});
