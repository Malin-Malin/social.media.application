
import { getAllPosts } from "../api/postsService.js"; 
import { generateCard } from "../Components/postCard.js";

//hva skal jeg gjøre

//data

const postMatrix = document.getElementById('post-matrix');

function generatePosts(posts) {
    //clear  content
    postMatrix.innerHTML = '';
    posts.forEach(post => {
        postMatrix.append(generateCard(post));
    });
}

async function main() {
// hent alle poster
//generere kort
    const posts = await getAllPosts(9,true);
    generatePosts(posts);
}

main();