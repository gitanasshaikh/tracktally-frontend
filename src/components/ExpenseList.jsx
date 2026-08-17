import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function ExpenseList({ onEdit }) {
    const API = `${import.meta.env.VITE_API_URL}/expenses`;

    const navigate = useNavigate();
    const { showToast } = useToast();

    const [expenses, setExpenses] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ========================================
    // DELETE MODAL
    // ========================================

    const [deleteExpenseId, setDeleteExpenseId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // ========================================
    // EXPORT LOADING
    // ========================================

    const [exportingPdf, setExportingPdf] = useState(false);
    const [exportingExcel, setExportingExcel] = useState(false);

    // ========================================
    // EXPORT OPTIONS
    // ========================================

    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportScope, setExportScope] = useState("all");

    const [exportMonth, setExportMonth] = useState(
        new Date().getMonth() + 1
    );

    const [exportYear, setExportYear] = useState(
        new Date().getFullYear()
    );

    const [exportFormat, setExportFormat] = useState("pdf");

    // ========================================
    // GET ALL EXPENSES
    // ========================================

    const fetchExpenses = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API);

            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }

            const data = await response.json();

            setExpenses(data);
        } catch (error) {
            console.error("Error fetching expenses:", error);

            setError(
                "Unable to load expenses. Please check your backend."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // LOAD ON PAGE OPEN
    // ========================================

    useEffect(() => {
        fetchExpenses();
    }, []);

    // ========================================
    // SEARCH
    // ========================================

    const searchExpense = async () => {
        if (searchName.trim() === "") {
            fetchExpenses();
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API}/search?name=${encodeURIComponent(searchName)}`
            );

            if (!response.ok) {
                throw new Error("Failed to search expenses");
            }

            const data = await response.json();

            setExpenses(data);
        } catch (error) {
            console.error("Search error:", error);

            setError("Unable to search expenses.");
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // CATEGORY FILTER
    // ========================================

    const filterByCategory = async (selectedCategory) => {
        setCategory(selectedCategory);

        if (selectedCategory === "") {
            fetchExpenses();
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API}/category/${selectedCategory}`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to filter by category"
                );
            }

            const data = await response.json();

            setExpenses(data);
        } catch (error) {
            console.error(
                "Category filter error:",
                error
            );

            setError("Unable to filter expenses.");
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // DATE FILTER
    // ========================================

    const filterByDate = async (selectedDate) => {
        setDate(selectedDate);

        if (selectedDate === "") {
            fetchExpenses();
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API}/date/${selectedDate}`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to filter by date"
                );
            }

            const data = await response.json();

            setExpenses(data);
        } catch (error) {
            console.error(
                "Date filter error:",
                error
            );

            setError("Unable to filter expenses.");
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // CLEAR FILTERS
    // ========================================

    const clearFilters = () => {
        setSearchName("");
        setCategory("");
        setDate("");

        fetchExpenses();
    };

    // ========================================
    // OPEN DELETE MODAL
    // ========================================

    const openDeleteModal = (id) => {
        setDeleteExpenseId(id);
        setDeleteModalOpen(true);
    };

    // ========================================
    // CLOSE DELETE MODAL
    // ========================================

    const closeDeleteModal = () => {
        if (deleting) {
            return;
        }

        setDeleteExpenseId(null);
        setDeleteModalOpen(false);
    };

    // ========================================
    // CONFIRM DELETE EXPENSE
    // ========================================

    const confirmDeleteExpense = async () => {
        if (!deleteExpenseId) {
            return;
        }

        setDeleting(true);

        try {
            const response = await fetch(
                `${API}/${deleteExpenseId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete expense"
                );
            }

            setExpenses((previousExpenses) =>
                previousExpenses.filter(
                    (expense) =>
                        expense.id !== deleteExpenseId
                )
            );

            showToast(
                "Expense deleted successfully",
                "success"
            );

            setDeleteModalOpen(false);
            setDeleteExpenseId(null);
        } catch (error) {
            console.error(
                "Delete error:",
                error
            );

            setError(
                "Failed to delete expense."
            );

            showToast(
                "Failed to delete expense",
                "error"
            );
        } finally {
            setDeleting(false);
        }
    };

    // ========================================
    // FORMAT AMOUNT
    // ========================================

    const formatAmount = (amount) => {
        return Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (dateString) => {
        if (!dateString) {
            return "";
        }

        const parts = dateString.split("-");

        if (parts.length !== 3) {
            return dateString;
        }

        const [year, month, day] = parts;

        return `${day}-${month}-${year}`;
    };

    // ========================================
    // OPEN EXPORT MODAL
    // ========================================

    const openExportModal = () => {
        setExportModalOpen(true);
    };

    // ========================================
    // CLOSE EXPORT MODAL
    // ========================================

    const closeExportModal = () => {
        if (
            exportingPdf ||
            exportingExcel
        ) {
            return;
        }

        setExportModalOpen(false);
    };

    // ========================================
    // EXPORT FILE
    // ========================================

    const downloadExportFile = async () => {
        const isPdf = exportFormat === "pdf";

        if (isPdf) {
            setExportingPdf(true);
        } else {
            setExportingExcel(true);
        }

        try {
            let exportUrl = isPdf
                ? `${API}/export/pdf`
                : `${API}/export/excel`;

            // ========================================
            // EXPORT SCOPE
            // ========================================

            if (exportScope === "month") {
                exportUrl +=
                    `?scope=month&year=${exportYear}&month=${exportMonth}`;
            }

            if (exportScope === "year") {
                exportUrl +=
                    `?scope=year&year=${exportYear}`;
            }

            // ========================================
            // REQUEST
            // ========================================

            const response = await fetch(exportUrl);

            if (!response.ok) {
                throw new Error("Export failed");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download =
                exportScope === "month"
                    ? `TrackTally_${exportMonth}_${exportYear}.${isPdf ? "pdf" : "xlsx"}`
                    : exportScope === "year"
                        ? `TrackTally_${exportYear}.${isPdf ? "pdf" : "xlsx"}`
                        : `TrackTally_All_Expenses.${isPdf ? "pdf" : "xlsx"}`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            // ========================================
            // SUCCESS
            // ========================================

            showToast(
                isPdf
                    ? "PDF exported successfully"
                    : "Excel exported successfully",
                "success"
            );

            setExportModalOpen(false);
        } catch (error) {
            console.error(
                "Export error:",
                error
            );

            showToast(
                isPdf
                    ? "Failed to export PDF"
                    : "Failed to export Excel",
                "error"
            );
        } finally {
            if (isPdf) {
                setExportingPdf(false);
            } else {
                setExportingExcel(false);
            }
        }
    };

    // ========================================
    // UI
    // ========================================

    return (
        <div className="expense-list-page">

            {/* HEADER */}

            <div className="expense-list-header">

                <div>
                    <span className="expense-eyebrow">
                        TRANSACTIONS
                    </span>

                    <h2>
                        All Expenses
                    </h2>

                    <p>
                        Search, filter and manage
                        your expenses.
                    </p>
                </div>

                <button
                    className="expense-add-button"
                    onClick={() =>
                        navigate("/add-expense")
                    }
                >
                    <span>+</span>
                    Add Expense
                </button>

            </div>

            {/* SEARCH + FILTERS */}

            <div className="expense-controls">

                <div className="expense-search">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search expense name..."
                        value={searchName}
                        onChange={(e) =>
                            setSearchName(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchExpense();
                            }
                        }}
                    />

                    <button
                        onClick={searchExpense}
                    >
                        Search
                    </button>

                </div>

                <div className="expense-filters">

                    <select
                        value={category}
                        onChange={(e) =>
                            filterByCategory(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            All Categories
                        </option>

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

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            filterByDate(
                                e.target.value
                            )
                        }
                        style={{
                            color: "#ffffff",
                            colorScheme: "dark"
                        }}
                    />

                    <button
                        className="clear-filter-button"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </div>

            </div>

            {/* ERROR */}

            {error && (
                <div className="expense-error">
                    ⚠️ {error}
                </div>
            )}

            {/* CONTENT */}

            <div className="expense-table-card">

                {loading ? (

                    <div className="expense-loading">

                        <div className="expense-spinner"></div>

                        <p>
                            Loading expenses...
                        </p>

                    </div>

                ) : expenses.length === 0 ? (

                    <div className="expense-empty">

                        <div className="empty-icon">
                            💸
                        </div>

                        <h3>
                            No expenses found
                        </h3>

                        <p>
                            Try changing your
                            search or filters.
                        </p>

                    </div>

                ) : (

                    <div className="expense-table-wrapper">

                        <table className="expense-table">

                            <thead>
                                <tr>
                                    <th>Expense</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {expenses.map(
                                    (expense) => (

                                        <tr
                                            key={
                                                expense.id
                                            }
                                        >

                                            <td
                                                data-label="Expense"
                                            >

                                                <div className="expense-name-cell">

                                                    <div className="expense-avatar">
                                                        {expense.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                expense.name
                                                            }
                                                        </strong>

                                                        {expense.note && (
                                                            <small>
                                                                {
                                                                    expense.note
                                                                }
                                                            </small>
                                                        )}

                                                    </div>

                                                </div>

                                            </td>

                                            <td
                                                data-label="Amount"
                                                className="expense-amount"
                                            >
                                                ₹
                                                {formatAmount(
                                                    expense.amount
                                                )}
                                            </td>

                                            <td
                                                data-label="Category"
                                            >

                                                <span
                                                    className={`category-pill category-${expense.category?.toLowerCase()}`}
                                                >
                                                    {
                                                        expense.category
                                                    }
                                                </span>

                                            </td>

                                            <td
                                                data-label="Date"
                                            >
                                                {formatDate(
                                                    expense.date
                                                )}
                                            </td>

                                            <td
                                                data-label="Payment"
                                            >

                                                <span className="payment-method">
                                                    {
                                                        expense.paymentMethod
                                                    }
                                                </span>

                                            </td>

                                            <td
                                                data-label="Actions"
                                            >

                                                <div className="expense-actions">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/edit/${expense.id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                expense.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* EXPORT SECTION */}

            <div className="expense-export-section">

                <div className="expense-export-info">

                    <strong>
                        Export Expenses
                    </strong>

                    <span>
                        Download your expense records
                        as a report.
                    </span>

                </div>

                <div className="expense-export-buttons">

                    <button
                        type="button"
                        className="expense-export-main-button"
                        onClick={openExportModal}
                    >
                        <span>📤</span>
                        Export Expenses
                    </button>

                </div>

            </div>

            {/* EXPORT MODAL */}

            {exportModalOpen && (

                <div
                    className="export-modal-overlay"
                    onClick={closeExportModal}
                >

                    <div
                        className="export-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="export-modal-header">

                            <div>

                                <span className="export-modal-eyebrow">
                                    EXPORT
                                </span>

                                <h3>
                                    Export Expenses
                                </h3>

                                <p>
                                    Choose which expense records
                                    you want to download.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="export-modal-close"
                                onClick={closeExportModal}
                                disabled={
                                    exportingPdf ||
                                    exportingExcel
                                }
                            >
                                ×
                            </button>

                        </div>

                        {/* EXPORT SCOPE */}

                        <div className="export-modal-section">

                            <label>
                                What do you want to export?
                            </label>

                            <div className="export-scope-options">

                                {/* ALL */}

                                <button
                                    type="button"
                                    className={`export-scope-option ${
                                        exportScope === "all"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setExportScope(
                                            "all"
                                        )
                                    }
                                >

                                    <span className="export-option-icon">
                                        📋
                                    </span>

                                    <span>

                                        <strong>
                                            All Expenses
                                        </strong>

                                        <small>
                                            Export all expense records
                                        </small>

                                    </span>

                                </button>

                                {/* MONTH */}

                                <button
                                    type="button"
                                    className={`export-scope-option ${
                                        exportScope === "month"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setExportScope(
                                            "month"
                                        )
                                    }
                                >

                                    <span className="export-option-icon">
                                        📅
                                    </span>

                                    <span>

                                        <strong>
                                            Monthly
                                        </strong>

                                        <small>
                                            Export expenses for a month
                                        </small>

                                    </span>

                                </button>

                                {/* YEAR */}

                                <button
                                    type="button"
                                    className={`export-scope-option ${
                                        exportScope === "year"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setExportScope(
                                            "year"
                                        )
                                    }
                                >

                                    <span className="export-option-icon">
                                        🗓️
                                    </span>

                                    <span>

                                        <strong>
                                            Yearly
                                        </strong>

                                        <small>
                                            Export expenses for a year
                                        </small>

                                    </span>

                                </button>

                            </div>

                        </div>

                        {/* MONTH + YEAR */}

                        {exportScope === "month" && (

                            <div className="export-date-selection">

                                <div className="export-field">

                                    <label>
                                        Month
                                    </label>

                                    <select
                                        value={exportMonth}
                                        onChange={(e) =>
                                            setExportMonth(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    >

                                        <option value="1">
                                            January
                                        </option>

                                        <option value="2">
                                            February
                                        </option>

                                        <option value="3">
                                            March
                                        </option>

                                        <option value="4">
                                            April
                                        </option>

                                        <option value="5">
                                            May
                                        </option>

                                        <option value="6">
                                            June
                                        </option>

                                        <option value="7">
                                            July
                                        </option>

                                        <option value="8">
                                            August
                                        </option>

                                        <option value="9">
                                            September
                                        </option>

                                        <option value="10">
                                            October
                                        </option>

                                        <option value="11">
                                            November
                                        </option>

                                        <option value="12">
                                            December
                                        </option>

                                    </select>

                                </div>

                                <div className="export-field">

                                    <label>
                                        Year
                                    </label>

                                    <select
                                        value={exportYear}
                                        onChange={(e) =>
                                            setExportYear(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    >

                                        {Array.from(
                                            {
                                                length: 7
                                            },
                                            (_, index) => {

                                                const year =
                                                    new Date().getFullYear() -
                                                    3 +
                                                    index;

                                                return (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                );

                                            }
                                        )}

                                    </select>

                                </div>

                            </div>

                        )}

                        {/* YEAR */}

                        {exportScope === "year" && (

                            <div className="export-date-selection">

                                <div className="export-field">

                                    <label>
                                        Year
                                    </label>

                                    <select
                                        value={exportYear}
                                        onChange={(e) =>
                                            setExportYear(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    >

                                        {Array.from(
                                            {
                                                length: 7
                                            },
                                            (_, index) => {

                                                const year =
                                                    new Date().getFullYear() -
                                                    3 +
                                                    index;

                                                return (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                );

                                            }
                                        )}

                                    </select>

                                </div>

                            </div>

                        )}

                        {/* FORMAT */}

                        <div className="export-modal-section">

                            <label>
                                Export Format
                            </label>

                            <div className="export-format-options">

                                <button
                                    type="button"
                                    className={`export-format-option ${
                                        exportFormat === "pdf"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setExportFormat(
                                            "pdf"
                                        )
                                    }
                                >
                                    📄 PDF
                                </button>

                                <button
                                    type="button"
                                    className={`export-format-option ${
                                        exportFormat === "excel"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setExportFormat(
                                            "excel"
                                        )
                                    }
                                >
                                    📊 Excel
                                </button>

                            </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="export-modal-actions">

                            <button
                                type="button"
                                className="export-cancel-button"
                                onClick={closeExportModal}
                                disabled={
                                    exportingPdf ||
                                    exportingExcel
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="export-confirm-button"
                                onClick={
                                    downloadExportFile
                                }
                                disabled={
                                    exportingPdf ||
                                    exportingExcel
                                }
                            >

                                {exportingPdf ||
                                exportingExcel
                                    ? "Exporting..."
                                    : "Export " +
                                        (
                                            exportFormat === "pdf"
                                                ? "PDF"
                                                : "Excel"
                                        )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* DELETE CONFIRMATION MODAL */}

            {deleteModalOpen && (

                <div
                    className="delete-modal-overlay"
                    onClick={closeDeleteModal}
                >

                    <div
                        className="delete-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="delete-modal-icon">
                            🗑️
                        </div>

                        <div className="delete-modal-content">

                            <h3>
                                Delete Expense?
                            </h3>

                            <p>
                                Are you sure you want to
                                delete this expense?
                                This action cannot be undone.
                            </p>

                        </div>

                        <div className="delete-modal-actions">

                            <button
                                type="button"
                                className="delete-modal-cancel"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="delete-modal-confirm"
                                onClick={
                                    confirmDeleteExpense
                                }
                                disabled={deleting}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Expense"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ExpenseList;