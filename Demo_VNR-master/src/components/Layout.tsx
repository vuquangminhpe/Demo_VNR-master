import { Link, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import LOGO from "../../public/image.png";
const Layout = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Scroll progress
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);

      // Header background change
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-shell">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar">
        <div
          className="scroll-progress-fill"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="Trang chủ Dấu ấn Người Cộng sản"
          >
            <div className="brand-icon">
              <img
                src={LOGO}
                alt=""
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10%",
                }}
              />
            </div>
            <div className="brand-text">
              <span className="brand-mark">Dấu ấn</span>
              <span className="brand-title">Người Cộng sản</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="main-nav desktop-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 7l7-5 7 5v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Trang chủ
            </NavLink>
            <NavLink
              to="/nhan-vat"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17 18v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M13 5a4 4 0 11-8 0 4 4 0 018 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Danh sách nhân vật
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 7l7-5 7 5v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Trang chủ
          </NavLink>
          <NavLink
            to="/nhan-vat"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M17 18v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M13 5a4 4 0 11-8 0 4 4 0 018 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Danh sách nhân vật
          </NavLink>
        </nav>
      </header>

      {/* Main Content */}
      <main className="site-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="gradient-text">Dấu ấn Người Cộng sản</h3>
              <p>Tự hào lịch sử, vững bước tương lai</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Khám phá</h4>
                <Link to="/">Trang chủ</Link>
                <Link to="/nhan-vat">Danh sách nhân vật</Link>
                <a href="#featured-events">Sự kiện tiêu biểu</a>
              </div>
              <div className="footer-column">
                <h4>Tài nguyên</h4>
                <a
                  href="https://vi.wikipedia.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia
                </a>
                <a
                  href="https://dangcongsan.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Đảng Cộng sản Việt Nam
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} Dấu ấn Người Cộng sản. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
