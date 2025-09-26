
import { getAllPosts, searchPosts, getPostsByUser } from "../api/postsService.js"; 
import { generateCard } from "../components/postCard.js";
import { isLoggedIn } from "../api/authService.js";

// Get the query string from the current URL
const urlParams = new URLSearchParams(window.location.search);

// Get the value of a specific parameter, e.g., "id"
const profileName = urlParams.get("pn");

let page = 1;
const limit = 12;

let mode = 'all'; // all, search or profile

//data
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const postMatrix = document.getElementById('post-matrix');
const loadMoreButton = document.getElementById('load-more-button');

loadMoreButton.addEventListener('click', async () => {
    page++;
    let posts = [];
    if (mode === 'profile') {
        posts = await getPostsByUser(profileName, limit, true, page);
    } else if (mode === 'search') { 
        const query = searchInput.value.toLowerCase();
        posts = await searchPosts(query, limit, true, page);
    } else {
        posts = await getAllPosts(limit, true, page);
    }       
    if (posts && posts.length > 0) {
        generatePosts(posts);
    } else {
        loadMoreButton.disabled = true;
        loadMoreButton.innerText = 'No more posts';
    }
});

function generatePosts(posts) {
    posts.forEach(post => {
        postMatrix.append(generateCard(post));
    });
}

function clearPosts() {
    postMatrix.innerHTML = '';
}

searchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    clearPosts();
    page = 1;
    const query = searchInput.value.toLowerCase();
    if (query) {
        mode = 'search';
        const posts = await searchPosts(query, limit, true);
        if (posts && posts.length > 0) {
            generatePosts(posts);
        } else {
            postMatrix.innerHTML = '<p>No posts found.</p>';
        }
    } else {
        mode = 'all';
        const posts = await getAllPosts(9, true);
        generatePosts(posts);

    }
});

async function main() {
    //TODO: is this only for logged in users? If so update nav bar too, if not why do i get 401 when not logged in?
    if (!isLoggedIn()) {
        window.location.href = '/account/login.html';
        return;
    }
    if (profileName) {
        mode = 'profile';
    } else {
        mode = 'all';
    }
    let posts = []
    if (mode === 'profile') {
        searchButton.classList.add('d-none');
        searchInput.classList.add('d-none');
        document.getElementById('page-header').innerText = `Posts by ${profileName}`;
        posts = await getPostsByUser(profileName, limit, true, 1);
    } else {
        posts = await getAllPosts(limit, true,1); 
    }
    clearPosts();
    generatePosts(posts);
}

main();