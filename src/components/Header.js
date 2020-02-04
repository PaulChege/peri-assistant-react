import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../auth/auth";
import { getToken } from "../auth/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../styling/styles.css";

class Header extends React.Component {
  onLogOut = () => {
    this.props.logout();
  };

  buttonStyle = {
    color: "white"
  };

  renderLogin = () => {
    if (getToken()) {
      return (
        <div>
          <Link
            style={this.buttonStyle}
            className="btn btn-primary btn-sm"
            to={"/"}
          >
            <FontAwesomeIcon icon={faUserCircle} className="icon-padded" />
            Account
          </Link>
          <button
            className="btn btn-primary btn-sm mx-sm-2"
            onClick={() => this.onLogOut()}
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
          style={this.buttonStyle}
        >
          Log In
        </Link>
        <Link
          className="btn btn-primary btn-sm"
          to="/signup"
          style={this.buttonStyle}
        >
          Sign Up
        </Link>
      </div>
    );
  };

  render() {
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
            <span className="navbar-text">{this.renderLogin()}</span>
          </div>
        </nav>
        <br />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSignedIn: state.user.isSignedIn
  };
};
export default connect(mapStateToProps, { logout })(Header);
