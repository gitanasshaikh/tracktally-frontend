const API_URL = "http://localhost:8080/expenses";

export const addExpense = async (expense) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    });

    if (!response.ok) {
        throw new Error("Failed to add expense");
    }

    return await response.json();
};