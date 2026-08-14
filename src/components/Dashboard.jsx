import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";


function Dashboard() {

    // ========================================
    // API
    // ========================================

    const API =
        `${import.meta.env.VITE_API_URL}/expenses`;

    const navigate = useNavigate();


    // ========================================
    // CONSTANTS
    // ========================================

    const currentYear =
        new Date().getFullYear();

    const currentMonth =
        new Date().getMonth() + 1;


    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    const chartColors = [
        "#6366f1",
        "#8b5cf6",
        "#ec4899",
        "#f59e0b",
        "#10b981",
        "#06b6d4",
        "#ef4444",
        "#84cc16"
    ];


    // ========================================
    // STATES
    // ========================================

    const [expenses, setExpenses] =
        useState([]);

    const [selectedMonth, setSelectedMonth] =
        useState(currentMonth);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================
    // LOAD EXPENSES
    // ========================================

    useEffect(() => {

        let cancelled = false;

        const loadExpenses = async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await fetch(API);


                if (!response.ok) {

                    throw new Error(
                        `Failed to load expenses: ${response.status}`
                    );

                }


                const data =
                    await response.json();


                if (!Array.isArray(data)) {

                    throw new Error(
                        "Invalid expenses response"
                    );

                }


                if (!cancelled) {

                    setExpenses(data);

                }


            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );


                if (!cancelled) {

                    setError(
                        "Unable to load dashboard data."
                    );

                }


            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };


        loadExpenses();


        return () => {

            cancelled = true;

        };

    }, []);


    // ========================================
    // TOTAL EXPENSE
    // ========================================

    const totalExpense = useMemo(() => {

        return expenses.reduce(
            (sum, expense) =>
                sum +
                Number(
                    expense.amount || 0
                ),
            0
        );

    }, [expenses]);


    // ========================================
    // EXPENSE COUNT
    // ========================================

    const expenseCount =
        expenses.length;


    // ========================================
    // CATEGORY DATA
    // ========================================

    const categoryData = useMemo(() => {

        const categoryMap = {};


        expenses.forEach((expense) => {

            const category =
                expense.category ||
                "Other";

            const amount =
                Number(
                    expense.amount || 0
                );


            categoryMap[category] =
                (categoryMap[category] || 0) +
                amount;

        });


        return Object.entries(
            categoryMap
        ).map(
            ([name, value]) => ({
                name,
                value
            })
        );

    }, [expenses]);


    // ========================================
    // MONTHLY DATA
    // ========================================

    const monthlyData = useMemo(() => {

        const amounts =
            Array(12).fill(0);


        expenses.forEach((expense) => {

            if (!expense.date) {
                return;
            }


            const parts =
                String(
                    expense.date
                ).split("-");


            if (parts.length !== 3) {
                return;
            }


            const year =
                Number(parts[0]);

            const month =
                Number(parts[1]);


            if (
                year === currentYear &&
                month >= 1 &&
                month <= 12
            ) {

                amounts[month - 1] +=
                    Number(
                        expense.amount || 0
                    );

            }

        });


        return months.map(
            (month, index) => ({

                month:
                    month.substring(0, 3),

                amount:
                    amounts[index]

            })
        );

    }, [expenses, currentYear]);


    // ========================================
    // SELECTED MONTH TOTAL
    // ========================================

    const monthlyTotal =
        monthlyData[
            selectedMonth - 1
        ]?.amount || 0;


    // ========================================
    // MONEY FORMAT
    // ========================================

    const formatMoney = (amount) => {

        return Number(amount || 0)
            .toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    };


    // ========================================
    // CUSTOM TOOLTIP
    // ========================================

    const CustomTooltip = ({
        active,
        payload,
        label
    }) => {

        if (
            !active ||
            !payload ||
            !payload.length
        ) {

            return null;

        }


        return (

            <div className="modern-tooltip">

                {label && (

                    <span className="tooltip-label">
                        {label}
                    </span>

                )}

                <strong>

                    ₹
                    {formatMoney(
                        payload[0].value
                    )}

                </strong>

            </div>

        );

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div className="dashboard">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="dashboard-header">

                <div>

                    <span className="dashboard-eyebrow">
                        FINANCIAL OVERVIEW
                    </span>

                    <h2>
                        Dashboard
                    </h2>

                    <p>
                        Track your spending and understand
                        where your money goes.
                    </p>

                </div>


                <button
                    className="dashboard-add-btn"
                    onClick={() =>
                        navigate("/add-expense")
                    }
                >

                    <span>
                        +
                    </span>

                    Add Expense

                </button>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className="dashboard-error">

                    ⚠️ {error}

                </div>

            )}


            {/* ==================================
                BACKGROUND LOADING
            ================================== */}

            {loading && (

                <div className="dashboard-background-loading">

                    <div className="loading-spinner"></div>

                    <span>
                        Updating dashboard...
                    </span>

                </div>

            )}


            {/* ==================================
                STAT CARDS
            ================================== */}

            <div className="dashboard-cards">


                {/* TOTAL */}

                <div className="dashboard-card total-card">

                    <div className="card-top">

                        <div className="card-icon">
                            ₹
                        </div>

                        <span className="card-badge">
                            Total
                        </span>

                    </div>


                    <div className="card-content">

                        <h3>
                            Total Expenses
                        </h3>

                        <p>

                            ₹
                            {formatMoney(
                                totalExpense
                            )}

                        </p>

                        <span>
                            All recorded expenses
                        </span>

                    </div>

                </div>


                {/* TRANSACTIONS */}

                <div className="dashboard-card transaction-card">

                    <div className="card-top">

                        <div className="card-icon">
                            #
                        </div>

                        <span className="card-badge">
                            Activity
                        </span>

                    </div>


                    <div className="card-content">

                        <h3>
                            Transactions
                        </h3>

                        <p>
                            {expenseCount}
                        </p>

                        <span>
                            Total transactions
                        </span>

                    </div>

                </div>


                {/* MONTH */}

                <div className="dashboard-card month-card">

                    <div className="card-top">

                        <div className="card-icon">

                            {
                                months[
                                    selectedMonth - 1
                                ].substring(0, 3)
                            }

                        </div>

                        <span className="card-badge">
                            {currentYear}
                        </span>

                    </div>


                    <div className="card-content">

                        <h3>
                            Monthly Expense
                        </h3>

                        <p>

                            ₹
                            {formatMoney(
                                monthlyTotal
                            )}

                        </p>

                        <span>

                            {
                                months[
                                    selectedMonth - 1
                                ]
                            }

                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================
                MONTH SELECTOR
            ================================== */}

            <div className="dashboard-month-box">

                <div>

                    <span className="section-label">
                        MONTHLY VIEW
                    </span>

                    <h3>
                        Monthly Overview
                    </h3>

                    <p>
                        Select a month to view its
                        total spending.
                    </p>

                </div>


                <select
                    value={selectedMonth}
                    onChange={(e) =>
                        setSelectedMonth(
                            Number(
                                e.target.value
                            )
                        )
                    }
                >

                    {months.map(
                        (month, index) => (

                            <option
                                key={month}
                                value={index + 1}
                            >
                                {month}
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ==================================
                MONTHLY BAR CHART
            ================================== */}

            <div className="dashboard-chart-card yearly-chart-card">

                <div className="section-heading">

                    <div>

                        <span className="section-label">

                            {
                                months[
                                    selectedMonth - 1
                                ].toUpperCase()
                            }

                            {" "}ANALYTICS

                        </span>

                        <h3>
                            Monthly Expenses
                        </h3>

                        <p>

                            Spending for{" "}

                            {
                                months[
                                    selectedMonth - 1
                                ]
                            }

                            {" "}
                            {currentYear}.

                        </p>

                    </div>

                </div>


                <div className="chart-container">

                    {monthlyTotal <= 0 ? (

                        <div className="empty-chart">

                            <div>
                                📊
                            </div>

                            <p>

                                No expense data available
                                for{" "}

                                <strong>

                                    {
                                        months[
                                            selectedMonth - 1
                                        ]
                                    }

                                </strong>

                            </p>

                        </div>

                    ) : (

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                            minWidth={0}
                        >

                            <BarChart
                                data={monthlyData}
                                margin={{
                                    top: 20,
                                    right: 10,
                                    left: -5,
                                    bottom: 10
                                }}
                                barCategoryGap="28%"
                            >

                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="4 6"
                                    opacity={0.35}
                                />


                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={8}
                                />


                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    width={42}
                                    tickFormatter={(value) => {

                                        if (
                                            value >= 100000
                                        ) {

                                            return `₹${(
                                                value / 100000
                                            ).toFixed(1)}L`;

                                        }


                                        if (
                                            value >= 1000
                                        ) {

                                            return `₹${(
                                                value / 1000
                                            ).toFixed(0)}k`;

                                        }


                                        return `₹${value}`;

                                    }}
                                />


                                <Tooltip
                                    content={
                                        <CustomTooltip />
                                    }
                                    cursor={{
                                        opacity: 0.08
                                    }}
                                />


                                <Bar
                                    dataKey="amount"
                                    fill="#6366f1"
                                    radius={[
                                        8,
                                        8,
                                        3,
                                        3
                                    ]}
                                    animationDuration={700}
                                    animationEasing="ease-out"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    )}

                </div>

            </div>


            {/* ==================================
                BOTTOM GRID
            ================================== */}

            <div className="dashboard-bottom-grid">


                {/* CATEGORY CHART */}

                <div className="dashboard-chart-card category-card">

                    <div className="section-heading">

                        <div>

                            <span className="section-label">
                                BREAKDOWN
                            </span>

                            <h3>
                                Spending by Category
                            </h3>

                            <p>
                                See where your money is going.
                            </p>

                        </div>

                    </div>


                    {categoryData.length === 0 ? (

                        <div className="empty-chart">

                            <div>
                                📊
                            </div>

                            <p>
                                No expense data available.
                            </p>

                        </div>

                    ) : (

                        <div className="chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                                minWidth={0}
                            >

                                <PieChart>

                                    <Pie
                                        data={categoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="46%"
                                        outerRadius="80%"
                                        innerRadius="60%"
                                        paddingAngle={4}
                                        cornerRadius={6}
                                        animationDuration={700}
                                        animationEasing="ease-out"
                                    >

                                        {categoryData.map(
                                            (_, index) => (

                                                <Cell
                                                    key={
                                                        `cell-${index}`
                                                    }
                                                    fill={
                                                        chartColors[
                                                            index %
                                                            chartColors.length
                                                        ]
                                                    }
                                                    stroke="none"
                                                />

                                            )
                                        )}

                                    </Pie>


                                    <Tooltip
                                        content={
                                            <CustomTooltip />
                                        }
                                    />


                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        wrapperStyle={{
                                            fontSize: "12px"
                                        }}
                                    />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </div>


                {/* CATEGORY SUMMARY */}

                <div className="dashboard-chart-card category-summary">

                    <div className="section-heading">

                        <div>

                            <span className="section-label">
                                SUMMARY
                            </span>

                            <h3>
                                Category Summary
                            </h3>

                            <p>
                                Total spending by category.
                            </p>

                        </div>

                    </div>


                    {categoryData.length === 0 ? (

                        <p className="no-data">
                            No category data available.
                        </p>

                    ) : (

                        <div className="category-grid">

                            {categoryData.map(
                                (category, index) => (

                                    <div
                                        className="category-item"
                                        key={
                                            category.name
                                        }
                                    >

                                        <div className="category-name">

                                            <span
                                                className="category-dot"
                                                style={{
                                                    background:
                                                        chartColors[
                                                            index %
                                                            chartColors.length
                                                        ]
                                                }}
                                            ></span>

                                            <span>
                                                {
                                                    category.name
                                                }
                                            </span>

                                        </div>


                                        <strong>

                                            ₹
                                            {formatMoney(
                                                category.value
                                            )}

                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}


export default Dashboard;