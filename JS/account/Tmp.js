
// ------------------------------------------------------------------

// app.js
import { getAllProfiles, searchProfiles } from "./api/profiles.js";

const listEl = document.querySelector("#profiles");
const pageInfo = document.querySelector("#pageInfo");
const btnPrev = document.querySelector("#prev");
const btnNext = document.querySelector("#next");
const form = document.querySelector("#searchForm");
const qInput = document.querySelector("#q");

let page = 1;
let limit = 12;
let currentQuery = "";

init();

async function init() {
  // Ensure you’ve already set localStorage accessToken + apiKey after login/api-key creation.
  await load();
}

async function load() {
  listEl.innerHTML = "<p>Loading…</p>";

  try {
    const json = currentQuery
      ? await searchProfiles(currentQuery)            // search endpoint is not paginated; keep it simple for now
      : await getAllProfiles({ page, limit });        // paginated

    const items = json.data || [];
    const meta = json.meta || {};

    listEl.innerHTML = items.map(renderCard).join("");

    if (currentQuery) {
      pageInfo.textContent = `Results: ${items.length}`;
      btnPrev.disabled = true;
      btnNext.disabled = true;
    } else {
      pageInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount || 1}`;
      btnPrev.disabled = !!meta.isFirstPage;
      btnNext.disabled = !!meta.isLastPage;
    }
  } catch (err) {
    listEl.innerHTML = `<p style="color:crimson">Failed: ${err.message}</p>`;
  }
}

function renderCard(p) {
  const avatar = p.avatar?.url || "https://placehold.co/400x240?text=No+Avatar";
  const name = p.name || "(no name)";
  const bio = p.bio || "";
  const posts = p._count?.posts ?? 0;
  const followers = p._count?.followers ?? 0;
  return `
    <article class="card">
      <img src="${avatar}" alt="${p.avatar?.alt || name}" />
      <h3>${name}</h3>
      <p>${bio}</p>
      <small>Posts: ${posts} · Followers: ${followers}</small>
    </article>
  `;
}

btnPrev.addEventListener("click", () => { if (page > 1) { page--; load(); } });
btnNext.addEventListener("click", () => { page++; load(); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentQuery = qInput.value.trim();
  page = 1;
  load();
});



// pagination
//default if empty banner/ profile image 