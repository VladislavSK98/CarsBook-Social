export async function addTrack(trackData) {
    const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData),
    });
    if (!res.ok) throw new Error('Failed to add track');
    return res.json();
}

// tracksApi.js
export async function getAllTracks() {
    const res = await fetch('/api/tracks');
    if (!res.ok) throw new Error('Failed to fetch tracks');
    return res.json();
}
