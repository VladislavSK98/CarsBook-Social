import apiClient from "./apiClient";

export const getPosts = () =>
  apiClient.get("/posts").then(res => res.data);

export const getPostById = (id) =>
  apiClient.get(`/posts/${id}`).then(res => res.data);

export const createPost = (data) =>
  apiClient.post("/posts", data).then(res => res.data);

export const addComment = (postId, data) =>
  apiClient.post(`/posts/${postId}/comments`, data).then(res => res.data);

export const likePost = (postId) =>
  apiClient.post(`/posts/${postId}/like`).then(res => res.data);

export const getLatestPosts = () =>
  apiClient.get("/posts").then(res => res.data);

export const updatePost = (postId, data) =>
  apiClient.put(`/posts/${postId}`, data).then(res => res.data);

export const deletePost = (postId) => apiClient.delete(`/posts/${postId}`).then(res => res.data);
