import { Link, NavLink, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Trang chủ Dấu ấn Người Cộng sản">
            <span className="brand-mark">Dấu ấn</span>
            <span className="brand-title">Người Cộng sản</span>
          </Link>
          <nav className="main-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Trang chủ
            </NavLink>
            <NavLink
              to="/nhan-vat"
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              Danh sách nhân vật
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>
            © {new Date().getFullYear()} Dấu ấn Người Cộng sản. Tự hào lịch sử, vững bước
            tương lai.
          </p>
          <div className="footer-links">
            <a href="#banner">Khởi nguồn</a>
            <Link to="/nhan-vat">Khám phá nhân vật</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
