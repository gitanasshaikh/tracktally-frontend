const API_URL = `${import.meta.env.VITE_API_URL}/expenses`;

export const getExpenses = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }

    return response.json();
};