import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const MenuLinks = () => (
    <>
      <Link to="/" onClick={closeMenu}>Home</Link>
      <Link to="/services" onClick={closeMenu}>Services</Link>
      <Link to="/team" onClick={closeMenu}>Our Team</Link>
      {user?.role === "Administrator" && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
      {user?.role === "Manager" && <Link to="/manager" onClick={closeMenu}>Manager</Link>}
      {user?.role === "Officer" && <Link to="/officer" onClick={closeMenu}>Officer</Link>}
      {user?.role === "Customer" && <Link to="/customer" onClick={closeMenu}>Customer</Link>}
      {!user && <Link to="/login" onClick={closeMenu}>Login</Link>}
      {!user ? (
        <Link to="/signup" onClick={closeMenu}>Signup</Link>
      ) : (
        <button className="logout-btn" onClick={() => { logout(); closeMenu(); }}>Logout</button>
      )}
    </>
  );

  return (
    <header>
      <div className="nonMenuLinks">
        <Link to="/" id="logo">Logo</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/team">Our Team</Link>
        </div>
      </div>

      <div className="header-right">
        {user && (
          <>
            <span>👤 </span>
            <span>{user.full_name}</span>
          </>
        )}

        <div className="menu-wrapper" ref={btnRef}>
          <div className="menu-btn" onClick={() => setOpen(!open)}>☰</div>

          {open && (
            <div className="dropdown-menu">
              <MenuLinks />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
