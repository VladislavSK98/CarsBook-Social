const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log("API_URL:", API_URL); // 👈 Провери дали правилно се зарежда

export const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Registration failed");
    }

    return response.json();
};

export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
    });
    
    // 👉 Провери какво връща бекендът
    console.log("Login response:", response);
    const data = await response.json();
    console.log("Login response data:", data); 

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return response.json();
};

export const getProfile = async () => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unauthorized");
    }

    return response.json();
};
