// import React from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./Navbar.css";
// import api from "../utils/api";

// const Navbar = () => {
//   const { user, setUser, loading } = useAuth();

//   const handleLogout = async () => {
//     try {
//       await api.get("/auth/logout");
//       setUser(null);
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   if (loading) return null; // or a spinner

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         {/* Logo */}
//         <div className="navbar-logo">
//           <Link to="/" className="navbar-logo-link">
//             LeadMasters
//           </Link>
//         </div>

//         {/* Links */}
//         <ul className="navbar-links">
//           {user ? (
//             <>
//               <li className="navbar-item">
//                 <span className="navbar-user">Hi, {user.name}</span>
//               </li>
//               <li className="navbar-item">
//                 <button className="navbar-btn" onClick={handleLogout}>
//                   Logout
//                 </button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li className="navbar-item">
//                 <a href="/login" className="navbar-link">
//                   Login
//                 </a>
//               </li>
//               {/* <li className="navbar-item">
//                 <a href="/signup" className="navbar-link">
//                   Signup
//                 </a>
//               </li> */}
//             </>
//           )}
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import api from "../utils/api";

const Navbar = () => {
  const { user, setUser, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      setUser(null);
      setIsOpen(false); // close menu after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="navbar-logo-link">
            LeadMasters
          </Link>
        </div>

        {/* Hamburger button */}
        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`bar ${isOpen ? "open" : ""}`} />
          <span className={`bar ${isOpen ? "open" : ""}`} />
          <span className={`bar ${isOpen ? "open" : ""}`} />
        </button>

        {/* Links */}
        <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
          {user ? (
            <>
              <li className="navbar-item">
                <span className="navbar-user">Hi, {user.name}</span>
              </li>
              <li className="navbar-item">
                <button className="navbar-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link
                  to="/login"
                  className="navbar-link"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/signup"
                  className="navbar-link"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
