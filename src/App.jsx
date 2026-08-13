import { useEffect, useState } from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import "./styles/App.css";
import "./styles/Feedback.css";

import AdminLogin from "./pages/AdminLogin";

import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/AdminFeedback";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import EditExpense from "./components/EditExpense";

import Home from "./components/Home";

import { ToastProvider } from "./context/ToastContext";


// =====================================================
// LAYOUT
// =====================================================

function AppLayout({
    theme,
    setTheme
}) {

    const location = useLocation();


    // ========================================
    // CHECK HOME PAGE
    // ========================================

    const isHomePage =
        location.pathname === "/";


    return (

        <>

            {/* ========================================
                NAVIGATION
            ======================================== */}

            {!isHomePage && (

                <Navbar
                    theme={theme}
                    setTheme={setTheme}
                />

            )}


            {/* ========================================
                ROUTES
            ======================================== */}

            <Routes>


                {/* ====================================
                    HOME
                ==================================== */}

                <Route
                    path="/"
                    element={
                        <Home
                            theme={theme}
                            setTheme={setTheme}
                        />
                    }
                />


                {/* ====================================
                    DASHBOARD
                ==================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <main>
                            <Dashboard />
                        </main>
                    }
                />


                {/* ====================================
                    EXPENSES
                ==================================== */}

                <Route
                    path="/expenses"
                    element={
                        <main>
                            <ExpenseList />
                        </main>
                    }
                />


                {/* ====================================
                    ADD EXPENSE
                ==================================== */}

                <Route
                    path="/add-expense"
                    element={
                        <main>
                            <ExpenseForm />
                        </main>
                    }
                />


                {/* ====================================
                    EDIT EXPENSE
                ==================================== */}

                <Route
                    path="/edit/:id"
                    element={
                        <main>
                            <EditExpense />
                        </main>
                    }
                />


                {/* ====================================
                    FEEDBACK
                ==================================== */}

                <Route
                    path="/feedback"
                    element={
                        <main>
                            <Feedback />
                        </main>
                    }
                />


                {/* ====================================
                    ADMIN FEEDBACK
                ==================================== */}

                <Route
                    path="/admin/feedback"
                    element={
                        <main>
                            <AdminFeedback />
                        </main>
                    }
                />

                <Route
                    path="/admin/login"
                    element={
                        <main>
                            <AdminLogin />
                        </main>
                    }
                />

            </Routes>

        </>

    );
}


// =====================================================
// APP
// =====================================================

function App() {

    // ========================================
    // THEME
    // ========================================

    const [theme, setTheme] = useState(() => {

        const savedTheme =
            localStorage.getItem(
                "tracktally-theme"
            );

        return savedTheme || "light";

    });


    // ========================================
    // APPLY THEME
    // ========================================

    useEffect(() => {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );


        localStorage.setItem(
            "tracktally-theme",
            theme
        );

    }, [theme]);


    // ========================================
    // UI
    // ========================================

    return (

        <ToastProvider>

            <BrowserRouter>

                <AppLayout
                    theme={theme}
                    setTheme={setTheme}
                />

            </BrowserRouter>

        </ToastProvider>

    );

}


export default App;