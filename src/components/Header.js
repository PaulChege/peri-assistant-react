import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { logout, getToken } from "../auth/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faGraduationCap,
  faBars,
  faTimes,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styling/styles.css";

function Header(props) {
  const navigate = useNavigate();
  // Set sidebar open by default on desktop, closed on mobile
  const getInitialSidebarState = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  };
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState());

  // Optional: update sidebar state on resize (if user resizes window)
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  const openSidebar = () => setSidebarOpen(true);

  const onLogOut = () => {
    props.logout();
    navigate("/login");
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  const renderSidebar = () => (
    <nav className={`sidebar${sidebarOpen ? " open" : ""}`}> 
      <div className="sidebar-header" style={{ justifyContent: 'center' }}>
        <Link to="/" onClick={closeSidebar} className="sidebar-logo" style={{ margin: '0 auto' }}>
          <img alt="logo" width="40px" height="40px" src="/logo.png" />
        </Link>
        <button
          className="sidebar-close sidebar-close-mobile"
          onClick={closeSidebar}
          aria-label="Close sidebar"
          style={{ display: window.innerWidth >= 768 ? 'none' : undefined }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faGraduationCap} className="icon-padded" /> Students
          </Link>
        </li>
        <li>
          <Link to="/calendar" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faCalendarAlt} className="icon-padded" /> Calendar View
          </Link>
        </li>
        <li>
          <Link to="/user" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faUserCircle} className="icon-padded" /> Account
          </Link>
        </li>
        <li>
          <button className="sidebar-link-btn" onClick={onLogOut}>
            <FontAwesomeIcon icon={faSignOutAlt} className="icon-padded" /> Log Out
          </button>
        </li>
      </ul>
    </nav>
  );

  return (
    <>
      <header className="header-bar">
        <button
          className="sidebar-toggle sidebar-toggle-mobile"
          onClick={openSidebar}
          aria-label="Open sidebar"
          style={{ display: window.innerWidth >= 768 ? 'none' : undefined }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        {/* Removed logo and title from header */}
      </header>
      {renderSidebar()}
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.user.isSignedIn,
  };
};
export default connect(mapStateToProps, { logout })(Header);
