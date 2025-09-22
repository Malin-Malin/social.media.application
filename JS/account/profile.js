// Look through I don't need all this
import { getProfileDeep } from "./api/profiles.js";

const el = {
  avatar: document.querySelector("#avatar"),
  banner: document.querySelector("#banner"),
  name: document.querySelector("#name"),
  bio: document.querySelector("#bio"),
  countPosts: document.querySelector("#countPosts"),
  countFollowers: document.querySelector("#countFollowers"),
  countFollowing: document.querySelector("#countFollowing"),

  overview: document.querySelector("#overview"),
  posts: document.querySelector("#posts"),
  followers: document.querySelector("#followers"),
  following: document.querySelector("#following"),

  feedback: document.querySelector("#feedback"),

  tabs: Array.from(document.querySelectorAll(".tab-btn")),
  panels: Array.from(document.querySelectorAll(".tab-panel")),
};

init();

async function init() {
  // 1) Read ?name= from the URL
  const params = new URLSearchParams(location.search);
  const name = params.get("name");
  if (!name) {
    showError("Missing ?name= in the URL. Example: profile.html?name=YourProfileName");
    return;
  }

  // 2) Load + render
  setFeedback("Loading profile…");
  try {
    const { data } = await getProfileDeep(name);
    renderHeader(data);
    renderOverview(data);
    renderPosts(data._posts || []);
    renderFollowers(data._followers || []);
    renderFollowing(data._following || []);
    clearFeedback();
  } catch (err) {
    showError(err.message);
  }

  // 3) Tabs behavior (accessible)
  setupTabs();
}

/* ---------- Rendering ---------- */

function renderHeader(p) {
  const avatar = p.avatar?.url || "https://placehold.co/128?text=No+Avatar";
  const banner = p.banner?.url || "https://placehold.co/1200x300?text=No+Banner";
  el.avatar.src = avatar;
  el.avatar.alt = p.avatar?.alt || p.name || "avatar";
  el.banner.src = banner;
  el.name.textContent = p.name || "(no name)";
  el.bio.textContent = p.bio || "";
  const posts = p._count?.posts ?? (p._posts?.length ?? 0);
  const followers = p._count?.followers ?? (p._followers?.length ?? 0);
  const following = p._count?.following ?? (p._following?.length ?? 0);
  el.countPosts.textContent = `Posts: ${posts}`;
  el.countFollowers.textContent = `Followers: ${followers}`;
  el.countFollowing.textContent = `Following: ${following}`;
}

function renderOverview(p) {
  const created = p.created ? new Date(p.created).toLocaleDateString() : "n/a";
  const updated = p.updated ? new Date(p.updated).toLocaleDateString() : "n/a";
  el.overview.innerHTML = `
    <div class="card">
      <h2>About</h2>
      <p><strong>Name:</strong> ${p.name || ""}</p>
      <p><strong>Bio:</strong> ${p.bio || "<span class='muted'>(none)</span>"}</p>
      <p class="muted">Created: ${created} • Updated: ${updated}</p>
    </div>
  `;
}

function renderPosts(posts) {
  if (!posts.length) {
    el.posts.innerHTML = `<p class="muted">No posts yet.</p>`;
    return;
  }
  el.posts.innerHTML = posts.map(renderPostCard).join("");
}

function renderPostCard(post) {
  const media = (post.media && post.media[0]) || null;
  const img = media?.url || "https://placehold.co/600x340?text=No+Image";
  const alt = media?.alt || post.title || "post media";
  const title = post.title || "(no title)";
  const body = post.body || "";
  const created = post.created ? new Date(post.created).toLocaleDateString() : "";
  const reactions = post._count?.reactions ?? 0;
  const comments = post._count?.comments ?? 0;

  return `
    <article class="card">
      <img src="${img}" alt="${alt}" style="width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:.5rem;" />
      <h3>${title}</h3>
      <p class="muted" style="margin:.25rem 0 .5rem 0;">${created}</p>
      <p>${escapeHtml(body)}</p>
      <p class="muted">❤️ ${reactions} • 💬 ${comments}</p>
    </article>
  `;
}

function renderFollowers(list) {
  el.followers.innerHTML = list.length
    ? list.map(renderSmallProfile).join("")
    : `<p class="muted">No followers yet.</p>`;
}

function renderFollowing(list) {
  el.following.innerHTML = list.length
    ? list.map(renderSmallProfile).join("")
    : `<p class="muted">Not following anyone.</p>`;
}

function renderSmallProfile(p) {
  const avatar = p.avatar?.url || "https://placehold.co/96?text=No+Avatar";
  const name = p.name || "(no name)";
  return `
    <article class="card">
      <div class="media">
        <img src="${avatar}" alt="${p.avatar?.alt || name}" />
        <div>
          <strong>${name}</strong>
          <div class="muted">${p.bio || ""}</div>
          <div style="margin-top:.5rem;">
            <a href="profile.html?name=${encodeURIComponent(name)}">View profile →</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

/* ---------- Tabs ---------- */

function setupTabs() {
  el.tabs.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.id));
  });
}

function activateTab(tabId) {
  el.tabs.forEach((b) => b.setAttribute("aria-selected", String(b.id === tabId)));
  el.panels.forEach((panel) => {
    const controlId = document.getElementById(tabId).getAttribute("aria-controls");
    panel.dataset.active = String(panel.id === controlId);
  });
}

/* ---------- Feedback / Utils ---------- */

function setFeedback(msg) {
  el.feedback.className = "loading";
  el.feedback.textContent = msg;
}

function clearFeedback() {
  el.feedback.textContent = "";
  el.feedback.className = "";
}

function showError(msg) {
  el.feedback.className = "error";
  el.feedback.textContent = msg;
}

function escapeHtml(s = "") {
  return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
