
import { getPostById, deletePost, updatePost, createPost } from "../api/postsService.js";
import { isLoggedIn } from "../api/authService.js";
import { getUserProfile } from "../api/authService.js";

const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button"); //endre?
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const postForm = document.getElementById("post-form");

async function initEditMode() {
    try {
        // showModal("Loading post...", "info", "Please wait", null, false);
        const post = await getPostById(postId, true);

        if (post.author.email !== getUserProfile().email) {
            // closeModal();
            // showModal("You are not authorized to edit this post", "error");
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
                // showModal("Deleting post...", "info", "Please wait", null, false);
                result = await deletePost(postId);
                // closeModal();
            }catch (error) {
                // closeModal();
                // showModal(error.message, "error");
            }
            if (result) {
                // console.log("OK");
                window.location.href = `/`;
            }
        });
        // closeModal();
    } catch (error) {
        if (error.message=='No post with such ID'){
            window.location.href = '/404.html'
        };
        // closeModal();
        // showModal(error.message, "error");
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
        // showModal("Please fill in all required fields", "error");
        console.log("Please fill in all required fields");
        return;
    }
    
    let post;
    try {
        // showModal("Saving post...", "info", "Please wait", null, false);
        if (postId) { 
            post = await updatePost(postId,{title:title,body:postBody,tags:tags,media:{url:mediaUrl,alt:mediaAlt}});
        } else {
            post = await createPost(title,postBody,tags,{url:mediaUrl,alt:mediaAlt});
        }
    window.location.href = `/post/post.html?id=${post.id}`;
        // closeModal();
    } catch (error) {
        // closeModal();
        // showModal(error.message, "error");
    }
});

if (!isLoggedIn()) {
    // Redirect to login page if not logged in
    window.location.href = `${window.location.origin}/account/login.html`; //correct path?
}else {
    if (postId) {
        initEditMode();
    }
}