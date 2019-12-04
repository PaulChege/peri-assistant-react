import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="col-sm-12">
      <Link to="/">
        <img alt="logo" width="45x" height="45px" src="/logo.png" />
      </Link>
      <h3>Peri Assistant</h3>
      <div className="float-right">
        <Link className="btn btn-primary" to="/login">
          Log In
        </Link>

        <Link className="btn btn-primary" to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Header;
