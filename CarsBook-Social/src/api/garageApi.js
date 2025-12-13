export async function getMyGarageData(userId) {
    const res = await fetch(`/api/garage/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch garage');
    return res.json();
}

export async function addCarToGarage(userId, carData) {
    const res = await fetch(`/api/garage/${userId}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
    });
    if (!res.ok) throw new Error('Failed to add car');
    return res.json();
}

export async function getUserPosts(userId) {
    const res = await fetch(`/api/posts/user/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user posts');
    return res.json();
}
