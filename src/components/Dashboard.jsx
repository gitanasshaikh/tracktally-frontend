import { useEffect, useState } from "react";

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

    const currentYear = new Date().getFullYear();

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


    // ========================================
    // STATES
    // ========================================

    const [totalExpense, setTotalExpense] = useState(0);

    const [expenseCount, setExpenseCount] = useState(0);

    const [categoryData, setCategoryData] = useState([]);

    const [monthlyTotal, setMonthlyTotal] = useState(0);

    const [monthlyData, setMonthlyData] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // API
    // ========================================

    const API = "http://localhost:8080/expenses";


    // ========================================
    // CHART COLORS
    // ========================================

    const chartColors = [
        "#6366f1",
        "#8b5cf6",
        "#06b6d4",
        "#10b981",
        "#f59e0b",
        "#ef4444"
    ];


    // ========================================
    // LOAD DASHBOARD
    // ========================================

    useEffect(() => {

        loadDashboard();

    }, [selectedMonth]);


    // ========================================
    // DASHBOARD DATA
    // ========================================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");


            // ====================================
            // TOTAL EXPENSE
            // ====================================

            const totalResponse =
                await fetch(`${API}/total`);

            if (!totalResponse.ok) {
                throw new Error(
                    "Failed to load total expense"
                );
            }

            const totalData =
                await totalResponse.json();

            setTotalExpense(
                Number(totalData || 0)
            );


            // ====================================
            // EXPENSE COUNT
            // ====================================

            const countResponse =
                await fetch(`${API}/count`);

            if (!countResponse.ok) {
                throw new Error(
                    "Failed to load expense count"
                );
            }

            const countData =
                await countResponse.json();

            setExpenseCount(
                Number(countData || 0)
            );


            // ====================================
            // CATEGORY DATA
            // ====================================

            const categoryResponse =
                await fetch(`${API}/category-total`);

            if (!categoryResponse.ok) {
                throw new Error(
                    "Failed to load category data"
                );
            }

            const categoryResult =
                await categoryResponse.json();

            const formattedCategoryData =
                categoryResult.map((item) => ({
                    name: item[0],
                    value: Number(item[1] || 0)
                }));

            setCategoryData(
                formattedCategoryData
            );


            // ====================================
            // MONTHLY TOTAL
            // ====================================

            const monthlyResponse =
                await fetch(
                    `${API}/monthly-total/${selectedMonth}`
                );

            if (!monthlyResponse.ok) {
                throw new Error(
                    "Failed to load monthly total"
                );
            }

            const monthlyResult =
                await monthlyResponse.json();

            setMonthlyTotal(
                Number(monthlyResult || 0)
            );


            // ====================================
            // YEARLY DATA
            // ====================================

            const yearlyResponse =
                await fetch(
                    `${API}/yearly-total/${currentYear}`
                );

            if (!yearlyResponse.ok) {
                throw new Error(
                    "Failed to load yearly data"
                );
            }

            const yearlyResult =
                await yearlyResponse.json();


            // ====================================
            // CREATE 12 MONTHS
            // ====================================

            const amounts =
                Array(12).fill(0);


            yearlyResult.forEach((item) => {

                const monthNumber =
                    Number(item[0]);

                const amount =
                    Number(item[1] || 0);


                if (
                    monthNumber >= 1 &&
                    monthNumber <= 12
                ) {

                    amounts[
                        monthNumber - 1
                    ] = amount;

                }

            });


            // ====================================
            // CHART DATA
            // ====================================

            const chartData =
                months.map((month, index) => ({
                    month:
                        month.substring(0, 3),

                    amount:
                        amounts[index]
                }));


            setMonthlyData(
                chartData
            );


        } catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

            setError(
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }

    };


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
    // LOADING SCREEN
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
    // SELECTED MONTH DATA CHECK
    // ========================================

    const selectedMonthAmount =
        monthlyData[selectedMonth - 1]?.amount || 0;


    const hasSelectedMonthData =
        Number(selectedMonthAmount) > 0;


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
                    onClick={() => {
                        window.location.href =
                            "/add-expense";
                    }}
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
                    onChange={(e) => {

                        setSelectedMonth(
                            Number(e.target.value)
                        );

                    }}
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
                YEARLY BAR CHART
            ================================== */}

            <div className="dashboard-chart-card yearly-chart-card">

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            {months[selectedMonth - 1].toUpperCase()} ANALYTICS
                        </span>

                        <h3>
                            Monthly Expenses
                        </h3>

                        <p>
                            Spending for{" "}
                            {months[selectedMonth - 1]}{" "}
                            {currentYear}.
                        </p>

                    </div>

                </div>


                <div className="chart-container">

                    {/* ==================================
                        NO DATA FOR SELECTED MONTH
                    ================================== */}

                  {Number(monthlyTotal) <= 0 ? (

                      <div className="empty-chart">

                          <div>
                              📊
                          </div>

                          <p>
                              No expense data available for{" "}
                              <strong>
                                  {months[selectedMonth - 1]}
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
                                    animationDuration={1000}
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


                {/* ==================================
                    CATEGORY CHART
                ================================== */}

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

                                        animationDuration={900}
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


                {/* ==================================
                    CATEGORY SUMMARY
                ================================== */}

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