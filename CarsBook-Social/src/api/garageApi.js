import apiClient from './apiClient';

export const getMyGarageData = (userId) =>
  apiClient.get(`/garage/${userId}`).then(res => res.data);

// export const addCarToGarage = (userId, carId) =>
//   apiClient.post(`/garage/${userId}/cars`, { carId }).then(res => res.data);

// export const getUserPosts = (userId) =>
//   apiClient.get(`/posts/user/${userId}`).then(res => res.data);


export async function addCarToGarage(userId, carId) {
  const res = await fetch(`/api/garage/${userId}/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carId }),
  });

  if (!res.ok) throw new Error('Failed to add car');
  return res.json();
}


export async function getUserPosts(userId) {
    const res = await fetch(`/api/posts/user/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user posts');
    return res.json();
}
