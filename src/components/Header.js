import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userLogout } from "../actions/users";
import { getToken } from "../auth/token";

class Header extends React.Component {
  onLogOut = () => {
    this.props.userLogout();
  };

  renderLogin = () => {
    if (getToken()) {
      return (
        <div>
          <Link className="btn btn-primary" to="/">
            Account
          </Link>
          <button className="btn btn-primary" onClick={() => this.onLogOut()}>
            Log Out
          </button>
        </div>
      );
    }
    return (
      <div>
        <Link className="btn btn-primary" to="/login">
          Log In
        </Link>
        <Link className="btn btn-primary" to="/signup">
          Sign Up
        </Link>
      </div>
    );
  };

  render() {
    return (
      <div className="col-sm-12">
        <Link to="/" className="text-decoration-none">
          <img alt="logo" width="45x" height="45px" src="/logo.png" />
        </Link>
        <h3>Peri Assistant</h3>
        <div className="float-right">{this.renderLogin()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSignedIn: state.user.isSignedIn
  };
};
export default connect(mapStateToProps, { userLogout })(Header);
