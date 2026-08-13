// import { NavLink } from "react-router-dom";
//
// function Sidebar({
//     darkMode,
//     setDarkMode,
//     isOpen,
//     setIsOpen
// }) {
//
//     const closeSidebar = () => {
//         setIsOpen(false);
//     };
//
//
//     return (
//         <>
//
//             {/* Mobile overlay */}
//
//             {isOpen && (
//                 <div
//                     className="sidebar-overlay"
//                     onClick={closeSidebar}
//                 ></div>
//             )}
//
//
//             {/* Sidebar */}
//
//             <aside
//                 className={`sidebar ${
//                     isOpen
//                         ? "sidebar-open"
//                         : ""
//                 }`}
//             >
//
//                 {/* Logo */}
//
//                 <div className="sidebar-logo">
//
//                     <div className="sidebar-logo-row">
//
//                         <div>
//
//                             <h1>
//                                 TrackTally
//                             </h1>
//
//                             <span>
//                                 Expense Manager
//                             </span>
//
//                         </div>
//
//
//                         {/* Close button */}
//
//                         <button
//                             className="sidebar-close"
//                             onClick={closeSidebar}
//                         >
//                             ✕
//                         </button>
//
//                     </div>
//
//                 </div>
//
//
//                 {/* Navigation */}
//
//                 <nav className="sidebar-nav">
//
//                     <NavLink
//                         to="/"
//                         className="sidebar-link"
//                         onClick={closeSidebar}
//                     >
//
//                         <span>
//                             🏠
//                         </span>
//
//                         Dashboard
//
//                     </NavLink>
//
//
//                     <NavLink
//                         to="/expenses"
//                         className="sidebar-link"
//                         onClick={closeSidebar}
//                     >
//
//                         <span>
//                             💰
//                         </span>
//
//                         Expenses
//
//                     </NavLink>
//
//
//                     <NavLink
//                         to="/add-expense"
//                         className="sidebar-link"
//                         onClick={closeSidebar}
//                     >
//
//                         <span>
//                             ➕
//                         </span>
//
//                         Add Expense
//
//                     </NavLink>
//
//                 </nav>
//
//
//                 {/* Bottom */}
//
//                 <div className="sidebar-bottom">
//
//                     {/* Theme toggle */}
//
//                     <button
//                         className="theme-toggle"
//                         onClick={() =>
//                             setDarkMode(
//                                 !darkMode
//                             )
//                         }
//                     >
//
//                         <span>
//                             {darkMode
//                                 ? "☀️"
//                                 : "🌙"}
//                         </span>
//
//                         {darkMode
//                             ? "Light Mode"
//                             : "Dark Mode"}
//
//                     </button>
//
//
//                     {/* Footer */}
//
//                     <div className="sidebar-footer">
//
//                         <span>
//                             TrackTally
//                         </span>
//
//                         <small>
//                             Expense Management System
//                         </small>
//
//                     </div>
//
//                 </div>
//
//             </aside>
//
//         </>
//     );
// }
//
// export default Sidebar;