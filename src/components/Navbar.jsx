import {
    Link,
    useLocation
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";



function Navbar({
    theme,
    setTheme
}) {

    const location = useLocation();


    // ========================================
    // MOBILE MENU
    // ========================================

    const [mobileOpen, setMobileOpen] =
        useState(false);


    // ========================================
    // THEME
    // ========================================

    const toggleTheme = () => {

        setTheme(
            theme === "dark"
                ? "light"
                : "dark"
        );

    };


    // ========================================
    // CLOSE MOBILE MENU
    // ========================================

    const closeMobileMenu = () => {

        setMobileOpen(false);

    };


    // ========================================
    // ESC KEY
    // ========================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape") {

                setMobileOpen(false);

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    return (

        <>


            {/* ========================================
                MOBILE TOP BAR
                Desktop par hidden
            ======================================== */}

            <div className="mobile-topbar">


                {/* BRAND */}

                <Link
                    to="/"
                    className="mobile-brand"
                    onClick={closeMobileMenu}
                >

                    <span className="logo">
                        💰
                    </span>

                    <span className="mobile-brand-name">
                        TrackTally
                    </span>

                </Link>


                {/* MENU BUTTON */}

                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={() =>
                        setMobileOpen(
                            previous =>
                                !previous
                        )
                    }
                    aria-label={
                        mobileOpen
                            ? "Close menu"
                            : "Open menu"
                    }
                    aria-expanded={
                        mobileOpen
                    }
                >

                    {mobileOpen
                        ? "✕"
                        : "☰"}

                </button>

            </div>



            {/* ========================================
                MOBILE OVERLAY
            ======================================== */}

            {mobileOpen && (

                <div
                    className="sidebar-overlay"
                    onClick={
                        closeMobileMenu
                    }
                ></div>

            )}



            {/* ========================================
                SIDEBAR

                Desktop:
                Always visible

                Mobile:
                Opens using hamburger
            ======================================== */}

            <aside
                className={`sidebar ${
                    mobileOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >


                {/* =================================
                    SIDEBAR BRAND
                ================================= */}

                <Link
                    to="/"
                    className="sidebar-brand"
                    onClick={
                        closeMobileMenu
                    }
                >

                    <span className="logo sidebar-logo">
                        💰
                    </span>


                    <div className="sidebar-brand-text">

                        <strong>
                            TrackTally
                        </strong>

                        <small>
                            Expense Manager
                        </small>

                    </div>

                </Link>



                {/* =================================
                    NAVIGATION
                ================================= */}

                <div className="sidebar-section">


                    <p className="sidebar-label">
                        MENU
                    </p>



                    {/* =================================
                        HOME
                    ================================= */}

                    <Link
                        to="/"
                        className={
                            location.pathname === "/"
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                        onClick={
                            closeMobileMenu
                        }
                    >

                        <span className="sidebar-icon">
                            🏠
                        </span>

                        <span>
                            Home
                        </span>

                    </Link>



                    {/* =================================
                        DASHBOARD
                    ================================= */}

                    <Link
                        to="/dashboard"
                        className={
                            location.pathname === "/dashboard"
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                        onClick={
                            closeMobileMenu
                        }
                    >

                        <span className="sidebar-icon">
                            📊
                        </span>

                        <span>
                            Dashboard
                        </span>

                    </Link>



                    {/* =================================
                        EXPENSES
                    ================================= */}

                    <Link
                        to="/expenses"
                        className={
                            location.pathname === "/expenses"
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                        onClick={
                            closeMobileMenu
                        }
                    >

                        <span className="sidebar-icon">
                            💳
                        </span>

                        <span>
                            Expenses
                        </span>

                    </Link>



                    {/* =================================
                        ADD EXPENSE
                    ================================= */}

                    <Link
                        to="/add-expense"
                        className={
                            location.pathname === "/add-expense"
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                        onClick={
                            closeMobileMenu
                        }
                    >

                        <span className="sidebar-icon">
                            ➕
                        </span>

                        <span>
                            Add Expense
                        </span>

                    </Link>

                </div>



                {/* =================================
                    SPACER
                ================================= */}

                <div className="sidebar-spacer"></div>



                {/* =================================
                    THEME BUTTON
                ================================= */}

                <div className="sidebar-bottom">

                    <button
                        type="button"
                        className="theme-button"
                        onClick={
                            toggleTheme
                        }
                    >

                        <span className="theme-icon">

                            {theme === "dark"
                                ? "☀️"
                                : "🌙"}

                        </span>


                        <span>

                            {theme === "dark"
                                ? "Light Mode"
                                : "Dark Mode"}

                        </span>


{/*                         <span className="theme-arrow"> */}
{/*                             → */}
{/*                         </span> */}

                    </button>


                    {/* =================================
                        FEEDBACK
                    ================================= */}

                    <Link
                        to="/feedback"
                        className={
                            location.pathname === "/feedback"
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                        onClick={closeMobileMenu}
                    >

                        <span className="sidebar-icon">
                            💬
                        </span>

                        <span>
                            Feedback
                        </span>

                    </Link>

                </div>


            </aside>

        </>

    );

}


export default Navbar;