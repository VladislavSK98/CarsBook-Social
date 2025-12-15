

import apiClient from './apiClient';

export const getPost = () => apiClient.get('/posts').then(res => res.data);
// src/api/postApi.js
import axios from "axios";

// export const getPostById = (id) => {
//   if (!id) throw new Error("getPostById called with undefined id");
//   return axios.get(`${baseUrl}/${id}`).then(res => res.data);
// };

export const getPostById = async (postId) => {
  const res = await axios.get(`posts/${postId}`);
  return res.data;
};

export const getPosts = async (postId) => {
  const response = await axios.get(`/api/posts/`);
  return response.data;
};


export const createPost = (postData) => apiClient.post('/posts', postData).then(res => res.data);

export const addComment = (postId, commentData) =>
  apiClient.post(`/posts/${postId}/comments`, commentData).then(res => res.data);

export const likePost = (postId) =>
    apiClient.post(`/posts/${postId}/like`).then(res => res.data);
  
export async function getLatestPosts() {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Failed to fetch latest posts');
  return res.json();
}
export const updatePost = (postId, data) =>
  apiClient.put(`/posts/${postId}`, data).then(res => res.data);

export const deletePost = (postId) => apiClient.delete(`/posts/${postId}`).then(res => res.data);
