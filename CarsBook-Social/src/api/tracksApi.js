

import apiClient from './apiClient';

export const addTrack = (trackData) =>
  apiClient.post('/tracks', trackData).then(res => res.data);

export const getAllTracks = () =>
  apiClient.get('/tracks').then(res => res.data);

export const addTrackForUser = (trackData) =>
  apiClient.post("/tracks/user", trackData).then(res => res.data);

export const addLapToTrack = (trackId, lapData) =>
  apiClient.post(`/tracks/${trackId}/lap`, lapData).then(res => res.data);
