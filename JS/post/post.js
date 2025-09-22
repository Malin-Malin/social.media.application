import { getPostById } from "../api/postsService.js";

// Get the query string from the current URL
const urlParams = new URLSearchParams(window.location.search);

// Get the value of a specific parameter, e.g., "id"
const postId = urlParams.get("id");

const postContainer = document.getElementById('post-container');

function displayPost(post) {

    const mediaUrl = post.media && post.media.url ? post.media.url : '/image/food_vibe02.jpg';
    const mediaAlt = post.media && post.media.alt ? post.media.alt : 'Generic fallback image';
            // ------------------------------------------------------------------
            const authorName = post.author?.name ?? post.owner ?? "Unknown";
            const authorAvatar = post.author?.avatar?.url : '/image/avatar.jpg'; // fallback image

    postContainer.innerHTML = `
    <img class="col-md-6 order-md-2 ps-4 d-flex"
    src="${mediaUrl}" alt="${mediaAlt}">
    <div class="col-md-6 order-md-1">	
        <h2>${post.title}</h2>
        <p class="lc-block text-secondary pb-4 post-body"></p>
        <div>
            <img src="${authorAvatar}" alt="${authorName}"/> 
            <strong>${authorName}</strong>
        </div>
    </div>
    `;

    postContainer.querySelector('.post-body').innerText = post.body;
}

async function main() {
    try {
        const post = await getPostById(postId);
        displayPost(post);    
    } catch (error) {
        window.location.href = '/404.html'
    }
}

main();


// -------------------------------------------------

import { getPostsByProfile } from "./api/posts.js"; //WRONG

// ...inside init() after you know `name`:
const postsRes = await getPostsByProfile(name, { author: true });
renderPosts(postsRes.data);
