const API_URL = `${import.meta.env.VITE_API_URL}/expenses`;


// ========================================
// GET EXPENSES
// ========================================

export const getExpenses = async () => {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }

    return response.json();
};


// ========================================
// ADD EXPENSE
// ========================================

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


    return response.json();

};