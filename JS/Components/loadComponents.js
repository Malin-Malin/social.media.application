
  const path = window.location.pathname; // e.g. "/library/data"
  const parts = path.split("/").filter(Boolean); // Remove empty parts
  const breadcrumbList = document.getElementById("breadcrumb-list");


  // Breadcrumb
  let url = "";
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


//   Loading
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>

// remember to make this work----------------------------------------

//   Headers
fetch('/components/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
    updateMenu();
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

//   Footer
fetch('/components/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  })
  .catch(error => console.error('Footer load failed:', error));