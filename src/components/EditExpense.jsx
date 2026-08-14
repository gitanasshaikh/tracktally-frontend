
import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import { useToast } from "../context/ToastContext";

function EditExpense() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { showToast } = useToast();

    const [expense, setExpense] = useState({
        name: "",
        amount: "",
        category: "Food",
        date: "",
        paymentMethod: "Cash",
        note: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // ========================================
    // LOAD EXPENSE
    // ========================================

    useEffect(() => {

        const loadExpense = async () => {

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/expenses/${id}`
                );

                if (!response.ok) {
                    throw new Error("Expense not found");
                }

                const data = await response.json();

                setExpense({
                    name: data.name || "",
                    amount: data.amount ?? "",
                    category: data.category || "Food",
                    date: data.date || "",
                    paymentMethod: data.paymentMethod || "Cash",
                    note: data.note || ""
                });

            } catch (error) {

                console.error(
                    "Error loading expense:",
                    error
                );

                setError(
                    "Unable to load this expense."
                );

                showToast(
                    "Failed to load expense",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        };

        loadExpense();

    }, [id]);


    // ========================================
    // INPUT CHANGE
    // ========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setExpense((previousExpense) => ({
            ...previousExpense,
            [name]: value
        }));

        setError("");

    };


    // ========================================
    // UPDATE EXPENSE
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // ========================================
        // NAME VALIDATION
        // ========================================

        if (!expense.name.trim()) {

            setError(
                "Please enter an expense name."
            );

            return;

        }


        // ========================================
        // AMOUNT VALIDATION
        // ========================================

        if (
            expense.amount === "" ||
            Number(expense.amount) <= 0
        ) {

            setError(
                "Please enter a valid amount greater than 0."
            );

            return;

        }


        // ========================================
        // DATE VALIDATION
        // ========================================

        if (!expense.date) {

            setError(
                "Please select a date."
            );

            return;

        }


        setSaving(true);


        try {

            // ========================================
            // PUT REQUEST
            // ========================================

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/expenses/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...expense,
                        amount: Number(expense.amount)
                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to update expense"
                );

            }


            const result =
                await response.json();


            console.log(
                "Expense updated:",
                result
            );


            // ========================================
            // SUCCESS TOAST
            // ========================================

            showToast(
                "Expense updated successfully",
                "success"
            );


            // ========================================
            // REDIRECT
            // ========================================

            setTimeout(() => {

                navigate("/expenses");

            }, 700);


        } catch (error) {

            console.error(
                "Update error:",
                error
            );

            setError(
                "Failed to update expense."
            );

            showToast(
                "Failed to update expense",
                "error"
            );

        } finally {

            setSaving(false);

        }

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="expense-form-page">

                <div className="expense-loading">

                    <div className="expense-spinner"></div>

                    <p>
                        Loading expense...
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // UI
    // ========================================

    return (

        <div className="expense-form-page">


            {/* HEADER */}

            <div className="expense-form-header">

                <div>

                    <span className="expense-eyebrow">
                        TRANSACTION
                    </span>

                    <h2>
                        Edit Expense
                    </h2>

                    <p>
                        Update the details of your expense.
                    </p>

                </div>

            </div>


            {/* FORM */}

            <div className="expense-form-card">

                <form onSubmit={handleSubmit}>

                    <div className="expense-form-grid">


                        {/* NAME */}

                        <div className="modern-form-group">

                            <label>

                                <span className="form-label-icon">
                                    🧾
                                </span>

                                Expense Name

                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Burger, Pizza..."
                                value={expense.name}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />

                        </div>


                        {/* AMOUNT */}

                        <div className="modern-form-group">

                            <label>

                                <span className="form-label-icon">
                                    ₹
                                </span>

                                Amount

                            </label>

                            <div className="amount-input-wrapper">

                                <span className="currency-symbol">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    value={expense.amount}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* CATEGORY */}

                        <div className="modern-form-group">

                            <label>

                                <span className="form-label-icon">
                                    📂
                                </span>

                                Category

                            </label>

                            <select
                                name="category"
                                value={expense.category}
                                onChange={handleChange}
                            >

                                <option value="Food">
                                    Food
                                </option>

                                <option value="Transport">
                                    Transport
                                </option>

                                <option value="Shopping">
                                    Shopping
                                </option>

                                <option value="Bills">
                                    Bills
                                </option>

                            </select>

                        </div>


                        {/* DATE */}

                        <div className="modern-form-group">

                            <label>

                                <span className="form-label-icon">
                                    📅
                                </span>

                                Date

                            </label>

                            <input
                                type="date"
                                name="date"
                                value={expense.date}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* PAYMENT */}

                        <div className="modern-form-group">

                            <label>

                                <span className="form-label-icon">
                                    💳
                                </span>

                                Payment Method

                            </label>

                            <select
                                name="paymentMethod"
                                value={expense.paymentMethod}
                                onChange={handleChange}
                            >

                                <option value="Cash">
                                    Cash
                                </option>

                                <option value="Card">
                                    Card
                                </option>

                                <option value="UPI">
                                    UPI
                                </option>

                            </select>

                        </div>


                        {/* NOTE */}

                        <div className="modern-form-group">

                            <label>

                                <span className="form-label-icon">
                                    📝
                                </span>

                                Note

                            </label>

                            <input
                                type="text"
                                name="note"
                                placeholder="e.g. Lunch with friends"
                                value={expense.note}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="form-error">

                            ⚠️ {error}

                        </div>

                    )}


                    {/* ACTIONS */}

                    <div className="expense-form-actions">

                        <button
                            type="button"
                            className="form-cancel-button"
                            onClick={() =>
                                navigate("/expenses")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="form-submit-button"
                            disabled={saving}
                        >

                            {saving ? (

                                <>
                                    <span className="button-spinner"></span>
                                    Updating...
                                </>

                            ) : (

                                <>
                                    <span>✓</span>
                                    Update Expense
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditExpense;