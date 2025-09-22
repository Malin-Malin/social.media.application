// A function that renders a single post card
import { shortenStringLength } from "../utils/string.js";
import { getUserProfile } from "../api/authService.js";

export function generateCard(post) {
 
    const title = shortenStringLength(post.title, 15);
    const ingress = shortenStringLength(post.body, 30);
    
//TODO: set fallback image
    const mediaUrl = post.media && post.media.url ? post.media.url : '/image/food_vibe02.jpg';
    const mediaAlt = post.media && post.media.alt ? post.media.alt : 'Generic fallback image';
    
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('col');

    const card = document.createElement('div');
    card.classList.add('card','shadow-sm');

    // TODO: Fix buttonlinks
    card.innerHTML = `<img aria-label="${mediaAlt}"
            class="bd-placeholder-img card-img-top" height="225"
            preserveAspectRatio="xMidYMid slice" role="img" width="100%"
            src="${mediaUrl}">
            <h2>${title}</h2>
            <div class="card-body">
            <p class="card-text">${ingress}</p>
            <div class="d-flex justify-content-between align-items-center">
                 <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary view-btn">View</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary edit-btn d-none">Edit</button>
                </div>
                <small class="text-body-secondary">9 mins</small>
            </div>
        </div>`


            // Add event listeners for navigation
    card.querySelector('.view-btn').addEventListener('click', () => {
    window.location.href = `/post/post.html?id=${post.id}`;
    });
    if(post.author.email==getUserProfile().email) {
        const editButton = card.querySelector('.edit-btn');
        editButton.addEventListener('click', () => {
            window.location.href = `/post/createPost.html?id=${post.id}`;
        });
        editButton.classList.remove('d-none');
    }
    cardContainer.append(card);
    return cardContainer
}