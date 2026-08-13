import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addExpense } from "../services/expenseApi";
import { useToast } from "../context/ToastContext";

function ExpenseForm() {

    const navigate = useNavigate();

    const { showToast } = useToast();


    // ========================================
    // DEFAULT EXPENSE
    // ========================================

    const defaultExpense = {
        name: "",
        amount: "",
        category: "Food",
        date: "",
        paymentMethod: "Cash",
        note: ""
    };


    // ========================================
    // EXPENSE STATE
    // ========================================

    const [expense, setExpense] =
        useState(defaultExpense);


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================
    // RESTORE SAVED DRAFT
    // ========================================

    useEffect(() => {

        const savedDraft =
            localStorage.getItem(
                "tracktally-expense-draft"
            );


        if (!savedDraft) {
            return;
        }


        try {

            const parsedDraft =
                JSON.parse(savedDraft);


            setExpense(parsedDraft);


        } catch (error) {

            console.error(
                "Failed to restore expense draft:",
                error
            );


            localStorage.removeItem(
                "tracktally-expense-draft"
            );

        }

    }, []);


    // ========================================
    // INPUT CHANGE
    // ========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setExpense(
            previousExpense => {

                const updatedExpense = {

                    ...previousExpense,

                    [name]: value

                };


                // ========================================
                // SAVE DRAFT
                // ========================================

                localStorage.setItem(

                    "tracktally-expense-draft",

                    JSON.stringify(
                        updatedExpense
                    )

                );


                return updatedExpense;

            }
        );


        setError("");

    };


    // ========================================
    // SUBMIT
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


        setLoading(true);


        try {

            // ========================================
            // ADD EXPENSE
            // ========================================

            const result =
                await addExpense({

                    ...expense,

                    amount:
                        Number(
                            expense.amount
                        )

                });


            console.log(
                "Expense saved:",
                result
            );


            // ========================================
            // SUCCESS TOAST
            // ========================================

            showToast(
                "Expense added successfully",
                "success"
            );


            // ========================================
            // CLEAR SAVED DRAFT
            // ========================================

            localStorage.removeItem(
                "tracktally-expense-draft"
            );


            // ========================================
            // RESET FORM
            // ========================================

            setExpense(
                defaultExpense
            );


            // ========================================
            // GO TO EXPENSE LIST
            // ========================================

            setTimeout(() => {

                navigate("/expenses");

            }, 700);


        } catch (error) {

            console.error(
                "Expense error:",
                error
            );


            setError(
                "Failed to add expense."
            );


            // ========================================
            // ERROR TOAST
            // ========================================

            showToast(
                "Failed to add expense",
                "error"
            );


        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // CANCEL
    // ========================================

    const handleCancel = () => {

        navigate("/expenses");

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div className="expense-form-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="expense-form-header">

                <div>

                    <span className="expense-eyebrow">
                        NEW TRANSACTION
                    </span>

                    <h2>
                        Add Expense
                    </h2>

                    <p>
                        Record a new expense and
                        keep your finances organized.
                    </p>

                </div>

            </div>


            {/* =================================
                FORM
            ================================= */}

            <div className="expense-form-card">

                <form onSubmit={handleSubmit}>


                    <div className="expense-form-grid">


                        {/* =================================
                            NAME
                        ================================= */}

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
                                placeholder="e.g. Burger, Pizza, Shopping..."
                                value={expense.name}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />

                        </div>


                        {/* =================================
                            AMOUNT
                        ================================= */}

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


                        {/* =================================
                            CATEGORY
                        ================================= */}

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


                        {/* =================================
                            DATE
                        ================================= */}

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


                        {/* =================================
                            PAYMENT METHOD
                        ================================= */}

                        <div className="modern-form-group">

                            <label>

                                <span className="form-label-icon">
                                    💳
                                </span>

                                Payment Method

                            </label>


                            <select
                                name="paymentMethod"
                                value={
                                    expense.paymentMethod
                                }
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


                        {/* =================================
                            NOTE
                        ================================= */}

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


                    {/* =================================
                        ERROR
                    ================================= */}

                    {error && (

                        <div className="form-error">

                            ⚠️ {error}

                        </div>

                    )}


                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="expense-form-actions">


                        {/* CANCEL */}

                        <button
                            type="button"
                            className="form-cancel-button"
                            onClick={handleCancel}
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="form-submit-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <span className="button-spinner"></span>

                                    Adding...

                                </>

                            ) : (

                                <>

                                    <span>
                                        +
                                    </span>

                                    Add Expense

                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default ExpenseForm;