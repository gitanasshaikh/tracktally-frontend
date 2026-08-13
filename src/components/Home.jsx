import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Home({ theme, setTheme }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef(null);


    // ========================================
    // CLOSE MENU WHEN CLICKING OUTSIDE
    // ========================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {

                setMenuOpen(false);

            }

        };


        if (menuOpen) {

            document.addEventListener(
                "mousedown",
                handleOutsideClick
            );

        }


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, [menuOpen]);


    // ========================================
    // TOGGLE THEME
    // ========================================

    const toggleTheme = () => {

        setTheme(
            theme === "dark"
                ? "light"
                : "dark"
        );

    };


    // ========================================
    // CLOSE MENU
    // ========================================

    const closeMenu = () => {

        setMenuOpen(false);

    };


    return (

        <div className="home-page">


            {/* =====================================
                HOME NAVIGATION
            ===================================== */}

            <header className="home-navbar">


                {/* BRAND */}

                <Link
                    to="/"
                    className="home-brand"
                    onClick={closeMenu}
                >

                    <span className="home-brand-logo">
                        💰
                    </span>

                    <span>

                        <strong>
                            TrackTally
                        </strong>

                        <small>
                            Expense Manager
                        </small>

                    </span>

                </Link>


                {/* MENU */}

                <div
                    className="home-menu-wrapper"
                    ref={menuRef}
                >


                    <button
                        className="home-menu-button"
                        onClick={() =>
                            setMenuOpen(
                                previous =>
                                    !previous
                            )
                        }
                        aria-label="Open navigation menu"
                        aria-expanded={menuOpen}
                    >

                        <span className="home-menu-lines">

                            <span></span>
                            <span></span>
                            <span></span>

                        </span>

                        <span className="home-menu-text">
                            Menu
                        </span>

                    </button>


                    {/* =================================
                        MENU PANEL
                    ================================= */}

                    {menuOpen && (

                        <div className="home-menu-panel">


                            <div className="home-menu-heading">

                                <span>
                                    NAVIGATION
                                </span>

                                <strong>
                                    TrackTally
                                </strong>

                            </div>


                            {/* HOME */}

                            <Link
                                to="/"
                                className="home-menu-link active"
                                onClick={closeMenu}
                            >

                                <span className="home-menu-icon">
                                    🏠
                                </span>

                                <span className="home-menu-link-text">

                                    <strong>
                                        Home
                                    </strong>

                                    <small>
                                        About TrackTally
                                    </small>

                                </span>

                            </Link>


                            {/* DASHBOARD */}

                            <Link
                                to="/dashboard"
                                className="home-menu-link"
                                onClick={closeMenu}
                            >

                                <span className="home-menu-icon">
                                    📊
                                </span>

                                <span className="home-menu-link-text">

                                    <strong>
                                        Dashboard
                                    </strong>

                                    <small>
                                        View spending overview
                                    </small>

                                </span>

                            </Link>


                            {/* EXPENSES */}

                            <Link
                                to="/expenses"
                                className="home-menu-link"
                                onClick={closeMenu}
                            >

                                <span className="home-menu-icon">
                                    💳
                                </span>

                                <span className="home-menu-link-text">

                                    <strong>
                                        Expenses
                                    </strong>

                                    <small>
                                        View and manage expenses
                                    </small>

                                </span>

                            </Link>


                            {/* ADD EXPENSE */}

                            <Link
                                to="/add-expense"
                                className="home-menu-link"
                                onClick={closeMenu}
                            >

                                <span className="home-menu-icon">
                                    ➕
                                </span>

                                <span className="home-menu-link-text">

                                    <strong>
                                        Add Expense
                                    </strong>

                                    <small>
                                        Record a new expense
                                    </small>

                                </span>

                            </Link>


                            {/* DIVIDER */}

                            <div className="home-menu-divider"></div>


                            {/* THEME */}

                            <button
                                className="home-theme-button"
                                onClick={toggleTheme}
                            >

                                <span className="home-menu-icon">

                                    {theme === "dark"
                                        ? "☀️"
                                        : "🌙"}

                                </span>


                                <span className="home-menu-link-text">

                                    <strong>

                                        {theme === "dark"
                                            ? "Light Mode"
                                            : "Dark Mode"}

                                    </strong>

                                    <small>
                                        Change appearance
                                    </small>

                                </span>


                                <span className="home-theme-status">

                                    {theme === "dark"
                                        ? "LIGHT"
                                        : "DARK"}

                                </span>

                            </button>


                        </div>

                    )}

                </div>

            </header>


            {/* =====================================
                HERO
            ===================================== */}

            <section className="home-hero">

                <div className="home-hero-content">

                    <span className="home-eyebrow">
                        SMART EXPENSE MANAGEMENT
                    </span>

                    <h1>
                        Take control of
                        <span> your expenses.</span>
                    </h1>

                    <p>
                        Track your daily spending, understand
                        where your money goes, and keep your
                        finances organized in one simple place.
                    </p>


                    <div className="home-hero-buttons">

                        <Link
                            to="/dashboard"
                            className="home-primary-button"
                        >
                            Get Started
                            <span>→</span>
                        </Link>


                        <Link
                            to="/expenses"
                            className="home-secondary-button"
                        >
                            View Expenses
                        </Link>

                    </div>

                </div>


                {/* =================================
                    PREVIEW
                ================================= */}

                <div className="home-preview">

                    <div className="preview-header">

                        <div>

                            <span>
                                THIS MONTH
                            </span>

                            <strong>
                                ₹12,450
                            </strong>

                        </div>


                        <div className="preview-icon">
                            💰
                        </div>

                    </div>


                    <div className="preview-label">
                        Total Spending
                    </div>


                    <div className="preview-items">

                        <div className="preview-item">

                            <span>
                                🍔 Food
                            </span>

                            <strong>
                                ₹4,200
                            </strong>

                        </div>


                        <div className="preview-item">

                            <span>
                                🚗 Transport
                            </span>

                            <strong>
                                ₹2,100
                            </strong>

                        </div>


                        <div className="preview-item">

                            <span>
                                🧾 Bills
                            </span>

                            <strong>
                                ₹3,500
                            </strong>

                        </div>


                        <div className="preview-item">

                            <span>
                                🛍️ Shopping
                            </span>

                            <strong>
                                ₹2,650
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                FEATURES
            ===================================== */}

            <section className="home-section">

                <div className="home-section-heading">

                    <span>
                        FEATURES
                    </span>

                    <h2>
                        Everything you need to manage expenses.
                    </h2>

                    <p>
                        Simple tools to help you stay organized
                        and understand your spending.
                    </p>

                </div>


                <div className="home-feature-grid">


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            💰
                        </div>

                        <h3>
                            Track Expenses
                        </h3>

                        <p>
                            Add and manage your daily expenses
                            quickly and easily.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            🔎
                        </div>

                        <h3>
                            Search & Filter
                        </h3>

                        <p>
                            Find expenses by name, category
                            or date whenever you need them.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            📊
                        </div>

                        <h3>
                            Spending Insights
                        </h3>

                        <p>
                            Understand your monthly and
                            category-wise spending.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            📄
                        </div>

                        <h3>
                            Export Reports
                        </h3>

                        <p>
                            Export your expense records
                            to PDF or Excel.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================
                HOW IT WORKS
            ===================================== */}

            <section className="home-section home-how-section">

                <div className="home-section-heading">

                    <span>
                        HOW IT WORKS
                    </span>

                    <h2>
                        Managing expenses is simple.
                    </h2>

                </div>


                <div className="home-steps">


                    <div className="home-step">

                        <div className="step-number">
                            01
                        </div>

                        <h3>
                            Add Expense
                        </h3>

                        <p>
                            Record your daily spending
                            with a few simple details.
                        </p>

                    </div>


                    <div className="step-line"></div>


                    <div className="home-step">

                        <div className="step-number">
                            02
                        </div>

                        <h3>
                            Track & Filter
                        </h3>

                        <p>
                            Search and filter your expenses
                            whenever you need them.
                        </p>

                    </div>


                    <div className="step-line"></div>


                    <div className="home-step">

                        <div className="step-number">
                            03
                        </div>

                        <h3>
                            Understand Spending
                        </h3>

                        <p>
                            Use your dashboard to understand
                            your spending patterns.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================
                DASHBOARD PREVIEW
            ===================================== */}

            <section className="home-section">

                <div className="home-dashboard-preview">

                    <div className="dashboard-preview-content">

                        <span>
                            YOUR SPENDING
                        </span>

                        <h2>
                            Your spending,
                            <br />
                            at a glance.
                        </h2>

                        <p>
                            Get a quick overview of your
                            expenses through your dashboard.
                        </p>


                        <Link
                            to="/dashboard"
                            className="home-primary-button"
                        >
                            Open Dashboard
                            <span>→</span>
                        </Link>

                    </div>


                    <div className="mini-dashboard">

                        <div className="mini-stat-grid">

                            <div className="mini-stat">

                                <small>
                                    TOTAL EXPENSE
                                </small>

                                <strong>
                                    ₹12,450
                                </strong>

                            </div>


                            <div className="mini-stat">

                                <small>
                                    EXPENSE COUNT
                                </small>

                                <strong>
                                    24
                                </strong>

                            </div>

                        </div>


                        <div className="mini-chart">

                            <div className="chart-title">
                                Monthly Spending
                            </div>


                            <div className="chart-bars">

                                <span style={{ height: "35%" }}></span>
                                <span style={{ height: "55%" }}></span>
                                <span style={{ height: "42%" }}></span>
                                <span style={{ height: "70%" }}></span>
                                <span style={{ height: "58%" }}></span>
                                <span style={{ height: "82%" }}></span>
                                <span style={{ height: "65%" }}></span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                WHY TRACKTALLY
            ===================================== */}

            <section className="home-section">

                <div className="home-section-heading">

                    <span>
                        WHY TRACKTALLY
                    </span>

                    <h2>
                        Simple. Organized. Insightful.
                    </h2>

                </div>


                <div className="home-benefits">

                    <div>

                        <strong>
                            Simple
                        </strong>

                        <p>
                            No complicated financial tools.
                            Just the features you actually need.
                        </p>

                    </div>


                    <div>

                        <strong>
                            Organized
                        </strong>

                        <p>
                            Keep all your expenses in one
                            clean and organized place.
                        </p>

                    </div>


                    <div>

                        <strong>
                            Insightful
                        </strong>

                        <p>
                            Understand your spending patterns
                            through useful summaries.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================
                FINAL CTA
            ===================================== */}

            <section className="home-cta">

                <span>
                    GET STARTED
                </span>

                <h2>
                    Ready to take control
                    of your spending?
                </h2>

                <p>
                    Start tracking your expenses with TrackTally.
                </p>


                <Link
                    to="/dashboard"
                    className="home-primary-button"
                >
                    Go to Dashboard
                    <span>→</span>
                </Link>

            </section>


            {/* =====================================
                FOOTER
            ===================================== */}

            <footer className="home-footer">

                <div>

                    <strong>
                        💰 TrackTally
                    </strong>

                    <span>
                        Expense Manager
                    </span>

                </div>


                <p>
                    © 2026 TrackTally
                </p>

            </footer>

        </div>

    );

}

export default Home;