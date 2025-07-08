import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/auth";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) setShow(false);
      else setShow(true);
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 shadow-md ${
        show ? "translate-y-0" : "-translate-y-full"
      } bg-white border-b border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-emerald-600">
          Budget<span className="text-gray-800">ary</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-gray-800 font-medium">
          <Link
            to="/dash"
            className="hover:text-emerald-600 hover:underline transition"
          >
            Dashboard
          </Link>
          <Link
            to="/add-expense"
            className="hover:text-emerald-600 hover:underline transition"
          >
            Add Expense
          </Link>
          <Link
            to="/add-income"
            className="hover:text-emerald-600 hover:underline transition"
          >
            Add Income
          </Link>
          <Link
            to="/analytics"
            className="hover:text-emerald-600 hover:underline transition"
          >
            Report
          </Link>
          <Link
            to="/budget"
            className="hover:text-emerald-600 hover:underline transition"
          >
            Budget Setting
          </Link>
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {auth?.user ? (
            <>
              <span className="text-gray-700 font-medium">
                Hi, {auth.user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-emerald-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 pb-4 text-gray-800 font-medium space-y-2">
          <Link
            to="/dash"
            className="block hover:text-emerald-600"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/add-expense"
            className="block hover:text-emerald-600"
            onClick={() => setMenuOpen(false)}
          >
            Add Expense
          </Link>
          <Link
            to="/add-income"
            className="block hover:text-emerald-600"
            onClick={() => setMenuOpen(false)}
          >
            Add Income
          </Link>
          <Link
            to="/report"
            className="block hover:text-emerald-600"
            onClick={() => setMenuOpen(false)}
          >
            Report
          </Link>
          <Link
            to="/budget"
            className="block hover:text-emerald-600"
            onClick={() => setMenuOpen(false)}
          >
            Budget Setting
          </Link>
          {auth?.user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block text-left w-full text-red-500 mt-2 hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block mt-2 text-emerald-600 hover:text-emerald-700"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
