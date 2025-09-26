
import { getPostById, deletePost, updatePost, createPost } from "../api/postsService.js";
import { isLoggedIn } from "../api/authService.js";
import { getUserProfile } from "../api/authService.js";

const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const postForm = document.getElementById("post-form");

async function initEditMode() {
    try {
        const post = await getPostById(postId, true);

        if (post.author.email !== getUserProfile().email) {
            window.location.href = `/`;
            return;
        }

        const pageHeader = document.getElementById("page-header");

        const title = document.getElementById("title");
        const body = document.getElementById("body");
        const tags = document.getElementById("tags");
        const mediaUrl = document.getElementById("media-url");
        const mediaAlt = document.getElementById("media-alt");

        title.value = post.title;
        body.value = post.body;
        tags.value = post.tags.join(", ");
        mediaUrl.value = post.media.url;
        mediaAlt.value = post.media.alt;

        pageHeader.innerHTML = "Edit A Blog Post";

        deleteButton.classList.remove("hidden");
        deleteButton.addEventListener("click", async (event) => {
            event.preventDefault();
            let result;
            try {
                result = await deletePost(postId);
            } catch (error) {
                console.error("Error deleting post:", error);}
            if (result) {
                window.location.href = `/`;
            }
        });
    } catch (error) {
        if (error.message == 'No post with such ID') {
            window.location.href = '/404.html'
        };
    }
}

saveButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const formData = new FormData(postForm);
    const title = formData.get("title");
    const postBody = formData.get("body");
    const tags = formData.get("tags").split(",").map(tag => tag.trim());
    const mediaUrl = formData.get("media-url");
    const mediaAlt = formData.get("media-alt");

    if (!title || !postBody || !mediaUrl) {
        console.error("Please fill in all required fields");
        return;
    }

    let post;
    try {
        if (postId) {
            post = await updatePost(postId, { title: title, body: postBody, tags: tags, media: { url: mediaUrl, alt: mediaAlt } });
        } else {
            post = await createPost(title, postBody, tags, { url: mediaUrl, alt: mediaAlt });
        }
        window.location.href = `/post/post.html?id=${post.id}`;
    } catch (error) {
        console.error("Error saving post:", error);
    }
});

async function main() {
    if (!isLoggedIn()) {
        // Redirect to login page if not logged in
        window.location.href = `/account/login.html`;
    } else {
        if (postId) {
            initEditMode();
        }
    }
}

main(); 