// Dynamic breadcrumb generator
// Place a <div id="breadcrumb"></div> where you want the breadcrumb to appear
// and include this script after loading the DOM

const breadcrumbMap = {
  '/index.html': ['Home'],
  '/account/profilePage.html': ['Home', 'Profile'],
  '/account/editProfilePage.html': ['Home', 'Profile', 'Edit'],
  '/post/createPost.html': ['Home', 'New Post'],
  '/post/feed.html': ['Home', 'Feed'],
  '/post/post.html': ['Home', 'Feed', 'Post'],
  // Add more mappings as needed
};

function getCurrentPath() {
  let path = window.location.pathname;
  // fallback for root
  if (path === '/' || path === '') return '/index.html';
  return path;
}

function buildBreadcrumb() {
  const path = getCurrentPath();
  const items = breadcrumbMap[path] || ['Home'];
  let html = '<ol class="breadcrumb breadcrumb-chevron p-3 bg-body-tertiary rounded-3">';
  for (let i = 0; i < items.length; i++) {
    if (i === 0) {
      // Home icon
      if (items.length === 1) {
        html += `<li class="breadcrumb-item active" aria-current="page">
          <svg class="bi" width="16" height="16" aria-hidden="true"><use xlink:href="#house-door-fill"></use></svg> Home
        </li>`;
      } else {
        html += `<li class="breadcrumb-item"><a class="link-body-emphasis" href="/index.html">
          <svg class="bi" width="16" height="16" aria-hidden="true"><use xlink:href="#house-door-fill"></use></svg> <span class="visually-hidden">Home</span></a></li>`;
      }
    } else if (i === items.length - 1) {
      html += `<li class="breadcrumb-item active" aria-current="page">${items[i]}</li>`;
    } else {
      // Intermediate links (customize hrefs as needed)
      html += `<li class="breadcrumb-item"><a class="link-body-emphasis fw-semibold text-decoration-none" href="#">${items[i]}</a></li>`;
    }
  }
  html += '</ol>';
  document.getElementById('breadcrumb').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', buildBreadcrumb);
