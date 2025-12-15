

import apiClient from './apiClient';

export const addTrack = (trackData) =>
  apiClient.post('/tracks', trackData).then(res => res.data);

// export const getAllTracks = () =>
//   apiClient.get('/tracks').then(res => res.data);
export const getAllTracks = async () => {
  try {
    const res = await apiClient.get('/tracks'); // backend route
    return res.data;
  } catch (err) {
    console.error("Failed to fetch tracks:", err);
    throw err;
  }
};

export const getTrackById = async (id) => {
  try {
    const res = await apiClient.get(`/tracks/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch track ${id}:`, err);
    throw err;
  }
};

export const addTrackForUser = (trackData) =>
  apiClient.post("/tracks/user", trackData).then(res => res.data);

export const addLapToTrack = (trackId, lapData) =>
  apiClient.post(`/tracks/${trackId}/lap`, lapData).then(res => res.data);
