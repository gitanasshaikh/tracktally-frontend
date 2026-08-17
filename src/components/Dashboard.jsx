import { useEffect, useState } from "react";
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

    const [totalExpense, setTotalExpense] =
        useState(0);

    const [expenseCount, setExpenseCount] =
        useState(0);

    const [categoryData, setCategoryData] =
        useState([]);

    const [monthlyData, setMonthlyData] =
        useState([]);

    const [selectedMonth, setSelectedMonth] =
        useState(currentMonth);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


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
    // LOAD DASHBOARD DATA
    // ========================================

    useEffect(() => {

        let cancelled = false;

        const loadDashboard = async () => {

            setError("");
            setRefreshing(true);

            try {

                // ========================================
                // LOAD ALL APIs IN PARALLEL
                // ========================================

                const [
                    totalResponse,
                    countResponse,
                    categoryResponse,
                    yearlyResponse
                ] = await Promise.all([

                    fetch(
                        `${API}/total`
                    ),

                    fetch(
                        `${API}/count`
                    ),

                    fetch(
                        `${API}/category-total`
                    ),

                    fetch(
                        `${API}/yearly-total/${currentYear}`
                    )

                ]);


                // ========================================
                // CHECK RESPONSES
                // ========================================

                if (!totalResponse.ok) {

                    throw new Error(
                        `Total API failed: ${totalResponse.status}`
                    );

                }

                if (!countResponse.ok) {

                    throw new Error(
                        `Count API failed: ${countResponse.status}`
                    );

                }

                if (!categoryResponse.ok) {

                    throw new Error(
                        `Category API failed: ${categoryResponse.status}`
                    );

                }

                if (!yearlyResponse.ok) {

                    throw new Error(
                        `Yearly API failed: ${yearlyResponse.status}`
                    );

                }


                // ========================================
                // READ ALL RESPONSES
                // ========================================

                const total =
                    await totalResponse.json();

                const count =
                    await countResponse.json();

                const categoryResult =
                    await categoryResponse.json();

                const yearlyResult =
                    await yearlyResponse.json();


                // ========================================
                // STOP IF COMPONENT UNMOUNTED
                // ========================================

                if (cancelled) {
                    return;
                }


                // ========================================
                // SET TOTAL
                // ========================================

                setTotalExpense(
                    Number(total || 0)
                );


                // ========================================
                // SET COUNT
                // ========================================

                setExpenseCount(
                    Number(count || 0)
                );


                // ========================================
                // CATEGORY DATA
                // ========================================

                const formattedCategoryData =
                    Array.isArray(categoryResult)
                        ? categoryResult.map(
                            (item) => ({

                                name:
                                    item[0] ||
                                    "Other",

                                value:
                                    Number(
                                        item[1] || 0
                                    )

                            })
                        )
                        : [];


                setCategoryData(
                    formattedCategoryData
                );


                // ========================================
                // MONTHLY DATA
                // ========================================

                const monthlyAmounts =
                    Array(12).fill(0);


                if (
                    Array.isArray(
                        yearlyResult
                    )
                ) {

                    yearlyResult.forEach(
                        (item) => {

                            const month =
                                Number(
                                    item[0]
                                );

                            const amount =
                                Number(
                                    item[1] || 0
                                );


                            if (
                                month >= 1 &&
                                month <= 12
                            ) {

                                monthlyAmounts[
                                    month - 1
                                ] = amount;

                            }

                        }
                    );

                }


                // ========================================
                // FORMAT MONTHLY DATA
                // ========================================

                const formattedMonthlyData =
                    months.map(
                        (month, index) => ({

                            month:
                                month.substring(
                                    0,
                                    3
                                ),

                            amount:
                                monthlyAmounts[
                                    index
                                ]

                        })
                    );


                setMonthlyData(
                    formattedMonthlyData
                );


            } catch (error) {

                console.error(
                    "Dashboard API Error:",
                    error
                );


                if (!cancelled) {

                    if (
                        error.message.includes(
                            "401"
                        )
                    ) {

                        setError(
                            "Dashboard API returned 401 Unauthorized."
                        );

                    } else {

                        setError(
                            "Unable to load dashboard data. Please try again."
                        );

                    }

                }

            } finally {

                if (!cancelled) {

                    setLoading(false);

                    setRefreshing(false);

                }

            }

        };


        // ========================================
        // LOAD DASHBOARD
        // ========================================

        loadDashboard();


        // ========================================
        // CLEANUP
        // ========================================

        return () => {

            cancelled = true;

        };

    }, [API, currentYear]);


    // ========================================
    // SELECTED MONTH TOTAL
    // ========================================

    const monthlyTotal =
        monthlyData[
            selectedMonth - 1
        ]?.amount || 0;


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
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="dashboard">

                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // UI
    // ========================================

    return (

        <div className="dashboard">


            {/* ==================================
                REFRESHING
            ================================== */}

            {refreshing && (

                <div className="dashboard-refreshing">

                    <div className="refresh-dot"></div>

                    <span>
                        Updating data...
                    </span>

                </div>

            )}


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
                        Track your spending and
                        understand where your money goes.
                    </p>

                </div>


                <button
                    className="dashboard-add-btn"
                    onClick={() =>
                        navigate(
                            "/add-expense"
                        )
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
                                ].substring(
                                    0,
                                    3
                                )
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
                        Select a month to view
                        its total spending.
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
                                value={
                                    index + 1
                                }
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

                            {" "}
                            ANALYTICS

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
                                    tickFormatter={
                                        (value) => {

                                            if (
                                                value >= 100000
                                            ) {

                                                return `₹${(
                                                    value / 100000
                                                ).toFixed(
                                                    1
                                                )}L`;

                                            }


                                            if (
                                                value >= 1000
                                            ) {

                                                return `₹${(
                                                    value / 1000
                                                ).toFixed(
                                                    0
                                                )}k`;

                                            }


                                            return `₹${value}`;

                                        }
                                    }
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
                                    animationDuration={500}
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


                {/* CATEGORY PIE */}

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
                                See where your money
                                is going.
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
                                        animationDuration={500}
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
                                Total spending by
                                category.
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