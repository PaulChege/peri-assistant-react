import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { logout, getToken } from "../auth/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import "../styling/styles.css";

function Header(props) {
  const navigate = useNavigate();

  const onLogOut = () => {
    props.logout();
    navigate("/login");
  };

  const buttonStyle = {
    color: "white",
  };

  const renderLogin = () => {
    if (getToken()) {
      return (
        <div>
          <Link
            style={buttonStyle}
            className="btn btn-primary btn-sm mx-sm-2"
            to="/"
          >
            <FontAwesomeIcon icon={faGraduationCap} className="icon-padded" />
            Students
          </Link>
          <Link
            style={buttonStyle}
            className="btn btn-primary btn-sm"
            to={`/user`}
          >
            <FontAwesomeIcon icon={faUserCircle} className="icon-padded" />
            Account
          </Link>
          <button
            className="btn btn-primary btn-sm mx-sm-2"
            onClick={onLogOut}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="icon-padded" />
            Log Out
          </button>
        </div>
      );
    }
    return (
      <div>
        <Link
          className="btn btn-primary btn-sm mx-sm-3"
          to="/login"
          style={buttonStyle}
        >
          Log In
        </Link>
        <Link
          className="btn btn-primary btn-sm"
          to="/signup"
          style={buttonStyle}
        >
          Sign Up
        </Link>
      </div>
    );
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/" className="navbar-brand">
          <img alt="logo" width="30x" height="30px" src="/logo.png" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <h4>Peri Assistant</h4>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav mr-auto"></ul>
          <span className="navbar-text">{renderLogin()}</span>
        </div>
      </nav>
      <br />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.user.isSignedIn,
  };
};
export default connect(mapStateToProps, { logout })(Header);
