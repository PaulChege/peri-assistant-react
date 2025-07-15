import React, { useEffect, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { connect, useSelector } from "react-redux";
import { createUser, googleLoginUser, clearUserCreateSuccess } from "../../actions/users";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "../LoadingIndicator";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";

const CLIENT_ID =
  "420797426729-kn0ggevqk789epdaic6mgev40gg0e5ch.apps.googleusercontent.com";

function UserCreate({ createUser, googleLoginUser, clearUserCreateSuccess, errors }) {
  const navigate = useNavigate();
  const userCreated = useSelector(state => state.user.userCreated);

  useEffect(() => {
    clearUserCreateSuccess(); // Clear flag on mount
    return () => clearUserCreateSuccess(); // Clear flag on unmount
  }, [clearUserCreateSuccess]);

  useEffect(() => {
    if (userCreated) {
      navigate("/");
    }
  }, [userCreated, navigate]);

  // Helper to fetch IP with timeout
  const fetchIpWithTimeout = () => {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 10000);
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          clearTimeout(timeout);
          resolve(data.ip || null);
        })
        .catch(() => {
          clearTimeout(timeout);
          resolve(null);
        });
    });
  };

  const onSubmit = useCallback(async (formValues) => {
    const ip = await fetchIpWithTimeout();
    await trackPromise(createUser({ ...formValues, ip_address: ip }));
  }, [createUser]);

  const renderForm = (input, placeholder, type = "") => (
    <div className="form-group">
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        className="form-control"
      />
    </div>
  );

  const handleLoginFailure = (response) => {
    console.log(response);
  };

  const login = async (response) => {
    const decoded = jwtDecode(response.credential);
    const ip = await fetchIpWithTimeout();
    await trackPromise(googleLoginUser({
      google_id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      image_url: decoded.picture,
      ip_address: ip,
    }));
  };

  return (
    <div className="auth-card">
      <img src="/logo.png" alt="logo" className="auth-logo" />
      <p className="text-danger">{errors}</p>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="name"
              render={({ input }) => renderForm(input, "Name")}
            />
            <Field
              name="email"
              render={({ input }) => renderForm(input, "Email", "email")}
            />
            <Field
              name="password"
              render={({ input }) =>
                renderForm(input, "Password", "password")
              }
            />
            <div className="text-center">
              <button className="btn btn-primary">Sign Up</button>
            </div>
            <div className="text-center">
              <LoadingIndicator />
            </div>
            <br />
          </form>
        )}
      />
      {/* Google login button with matching width */}
      <div className="auth-btn-row" style={{ marginTop: '1rem' }}>
        <GoogleLogin
          onSuccess={async (response) => { await login(response); }}
          onError={handleLoginFailure}
          width="100%"
          text="signup_with"
        />
      </div>
      {/* Add Login button at the bottom */}
      <div className="auth-btn-row" style={{ marginTop: '1.5rem' }}>
        <Link to="/login" className="btn btn-outline-secondary">
          Log In
        </Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errors: state.errors.userCreateError,
  };
};

export default connect(mapStateToProps, { createUser, googleLoginUser, clearUserCreateSuccess })(UserCreate);
