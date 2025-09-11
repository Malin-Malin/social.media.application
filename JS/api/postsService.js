// Handles creating, reading, updating posts
import {post, get, put, del} from './apiClient.js';

const postEndpoint = '/social/posts';
const searchPostEndpoint = '/social/posts/search?q=<query></query>';

export async function getPostById(id,includeAuthor=false) {
    const response = await get(`${postEndpoint}/${id}?_author=${includeAuthor}`);
    return response.data;
}


export async function getAllPosts() {
    const response = await get(postEndpoint);
    return response.data;
};

export async function createPost(title, body, tags = [], media ='') {
    const newPost = {
        title,
        body,
        tags,
        media,
    };
try {
    const response = await post(postEndpoint, newPost);
    return response.data;
} catch (error) {
    console.error('Error creating a post:', error);
}
}

export async function updatePost(id, updatedData) {
   const response = await put(`${postEndpoint}/${id}`, updatedData);
   return response.data
}

export async function deletePost(id) {
    const response = await del(`${postEndpoint}/${id}`);
    return response.data;
}

export async function searchPosts(query) {
    const response = await get(`${searchPostEndpoint}/${query}`);
    return response.data
}