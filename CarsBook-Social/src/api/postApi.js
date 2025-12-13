

import apiClient from './apiClient';

export const getPosts = () => apiClient.get('/posts').then(res => res.data);

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