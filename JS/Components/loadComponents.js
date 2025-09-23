
  const path = window.location.pathname; // e.g. "/library/data"
  const parts = path.split("/").filter(Boolean); // Remove empty parts
  const breadcrumbList = document.getElementById("breadcrumb-list");


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

  // Breadcrumb
  // let url = "";
  // parts.forEach((part, index) => {
  //   url += `/${part}`;
  //   const li = document.createElement("li");
  //   li.className = "breadcrumb-item";

  //   const isLast = index === parts.length - 1;

  //   if (isLast) {
  //     li.classList.add("active");
  //     li.setAttribute("aria-current", "page");
  //     li.textContent = decodeURIComponent(part);
  //   } else {
  //     li.innerHTML = `<a class="link-body-emphasis fw-semibold text-decoration-none" href="${url}">${decodeURIComponent(part)}</a>`;
  //   }

  //   breadcrumbList.appendChild(li);
  // });


//   Loading
{/* <div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div> */}



// remember to make this work----------------------------------------

//   Headers
fetch('/components/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('main-header').innerHTML = data;
    // updateMenu();
    const signOutElement = document.getElementById("sign-out");
    if (signOutElement) {
      signOutElement.addEventListener("click", function() {
        logout()
          .then(() => {
            window.location.href = "/index.html";
          })
          .catch(error => {
            console.error("Logout failed:", error);
          });
      });
    }
  })
  .catch(error => console.error('Header load failed:', error));


  // Breadcrumbs - CODING 

fetch('/components/breadcrumb.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('breadcrumb').innerHTML = data;
    // Optionally, update the breadcrumb items here based on the current page
    let url = ""; // Reset URL for breadcrumb links
    parts.forEach((part, index) => {
      url += `/${part}`;
      const li = document.createElement("li");
      li.className = "breadcrumb-item";
      const isLast = index === parts.length - 1;
      if (isLast) {
        li.classList.add("active");
        li.setAttribute("aria-current", "page");
        li.textContent = decodeURIComponent(part);
      } else {
        li.innerHTML = `<a class="link-body-emphasis fw-semibold text-decoration-none" href="${url}">${decodeURIComponent(part)}</a>`;
      }
      breadcrumbList.appendChild(li);
    });
  })
  .catch(error => console.error('Breadcrumb load failed:', error));


  // Breadcrumbs WHEN I ASKED THE CHAT

  // fetch('/Components/breadcrumb.html')
  // .then(response => response.text())
  // .then(data => {
  //   document.getElementById('breadcrumb').innerHTML = data;
  //   // Optionally, update the breadcrumb items here based on the current page
  // });

  //   Footer
fetch('/components/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('main-footer').innerHTML = data;
  })
  .catch(error => console.error('Footer load failed:', error));
