import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">Eventera</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
      <footer className="footer mt-auto py-3 bg-light fixed-bottom">
        <div className="container text-center">
          <span className="text-muted">2025 Eventera</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
