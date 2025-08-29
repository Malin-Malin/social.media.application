import { createPost, getPost, updatePost, deletePost, isLoggedIn} from "../api.js";
import { showModal, closeModal } from "../components/modal.js";

const submitButton = document.querySelector("#submit");
const deleteButton = document.querySelector("#delete");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const postForm = document.querySelector("#post-form");

async function initEditMode() {
    try {
        showModal("Loading post...", "info", "Please wait", null, false);

        const result = await getPost(postId);
        if (!result) {
            closeModal();
            showModal("Post not found", "error");
            return;
        }
        
        const post = result.data;
        const pageHeader = document.querySelector("#page-header");

        const title = document.querySelector("#post-title");
        const body = document.querySelector("#post-body");
        const tags = document.querySelector("#post-tags");
        const mediaUrl = document.querySelector("#post-media-url");
        const mediaAlt = document.querySelector("#post-media-alt");

        title.value = post.title;
        body.value = post.body;
        tags.value = post.tags.join(", ");
        mediaUrl.value = post.media.url;
        mediaAlt.value = post.media.alt;
        
        submitButton.innerHTML = "Update";
        pageHeader.innerHTML = "Edit A Blog Post";

        const titleElement = document.querySelector("title");
        titleElement.innerHTML = "Edit Post - " + post.title;
        
        deleteButton.classList.remove("hidden");
        deleteButton.addEventListener("click", async () => {
            let result;
            try {
                showModal("Deleting post...", "info", "Please wait", null, false);
                result = await deletePost(postId);
                closeModal();
            }catch (error) {
                closeModal();
                showModal(error.message, "error");
            }
            if (result) {
                window.location.href = window.location.origin;
            }
        });
        closeModal();
    } catch (error) {
        closeModal();
        showModal(error.message, "error");
    }
}

submitButton.addEventListener("click", async () => {
    const formData = new FormData(postForm);
    const title = formData.get("title");
    const postBody = formData.get("postBody");
    const tags = formData.get("tags").split(",").map(tag => tag.trim());
    const mediaUrl = formData.get("mediaUrl");
    const mediaAlt = formData.get("mediaAlt");

    if (!title || !postBody || !mediaUrl) {
        showModal("Please fill in all required fields", "error");
        return;
    }

    let result;
    try {
        showModal("Saving post...", "info", "Please wait", null, false);
        if (postId) { 
            result = await updatePost(postId,title,postBody,tags,mediaUrl,mediaAlt);
        } else {
            result = await createPost(title,postBody,tags,mediaUrl,mediaAlt);
        }
        window.location.href = `${window.location.origin}/post/?id=${result.data.id}`;
        closeModal();
    } catch (error) {
        closeModal();
        showModal(error.message, "error");
    }
});

if (!isLoggedIn()) {
    // Redirect to login page if not logged in
    window.location.href = `${window.location.origin}/account/login.html`;
}else {
    if (postId) {
        initEditMode();
    }
}