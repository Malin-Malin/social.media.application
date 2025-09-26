// Handles creating, reading, updating posts
import {post, get, put, del} from './apiClient.js';

const postEndpoint = '/social/posts';
const searchPostEndpoint = '/social/posts/search';
const profilePostsEndpoint = '/social/profiles';

export async function getPostById(id,includeAuthor=false) {
    const response = await get(`${postEndpoint}/${id}?_author=${includeAuthor}`);
    return response.data;
}

export async function getAllPosts(limit = 9, includeAuthor=false, page=1) {
    const response = await get(`${postEndpoint}?limit=${limit}&page=${page}&_author=${includeAuthor}`);
    return response.data;
};

export async function getPostsByUser(userName, limit = 9, includeAuthor=false, page=1) {    
    const response = await get(`${profilePostsEndpoint}/${userName}/posts?limit=${limit}&page=${page}&_author=${includeAuthor}`);   
    return response.data;
}


export async function createPost(title, body, tags = [], media) {
    const newPost = {
        title:title,
        body:body,
        tags:tags,
        media:media
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
   return response.data;
}

export async function deletePost(id) {
    await del(`${postEndpoint}/${id}`);
    return true;
}

export async function searchPosts(query, limit = 9, includeAuthor=false, page=1) {
    const response = await get(`${searchPostEndpoint}?q=${query}&limit=${limit}&page=${page}&_author=${includeAuthor}`);
    return response.data;
}