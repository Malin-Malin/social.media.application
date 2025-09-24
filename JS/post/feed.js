
import { getAllPosts, searchPosts, getPostsByUser } from "../api/postsService.js"; 
import { generateCard } from "../Components/postCard.js";

// Get the query string from the current URL
const urlParams = new URLSearchParams(window.location.search);

// Get the value of a specific parameter, e.g., "id"
const profileName = urlParams.get("pn");

//hva skal jeg gjøre

//data
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const postMatrix = document.getElementById('post-matrix');

function generatePosts(posts) {
    //clear  content
    postMatrix.innerHTML = '';
    posts.forEach(post => {
        postMatrix.append(generateCard(post));
    });
}

searchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const query = searchInput.value.toLowerCase();
    if (query) {
        const posts = await searchPosts(query, 9, true);
        if (posts && posts.length > 0) {
            generatePosts(posts);
        } else {
            postMatrix.innerHTML = '<p>No posts found.</p>';
        }
    } else {
        const posts = await getAllPosts(9, true);
        generatePosts(posts);
    }
});

async function main() {
    let posts = []
    if (profileName) {
        searchButton.classList.add('d-none');
        searchInput.classList.add('d-none');
        document.getElementById('page-header').innerText = `Posts by ${profileName}`;
        posts = await getPostsByUser(profileName, 9, true);
    } else {
        posts = await getAllPosts(9, true); 
    }
    generatePosts(posts);
}

main();