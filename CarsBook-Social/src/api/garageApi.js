import apiClient from "./apiClient";

export const getMyGarageData = (userId) =>
  apiClient.get(`/garage/${userId}`).then(res => res.data);

export const addCarToGarage = (userId, carId) =>
  apiClient
    .post(`/garage/${userId}/cars`, { carId })
    .then(res => res.data);

export const getUserPosts = (userId) =>
  apiClient.get(`/posts/user/${userId}`).then(res => res.data);
