import React, { useEffect } from "react";
import { Field, Form } from "react-final-form";
import { connect, useSelector } from "react-redux";
import { loginUser, googleLoginUser } from "../actions/users";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "./LoadingIndicator";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const CLIENT_ID =
  "420797426729-kn0ggevqk789epdaic6mgev40gg0e5ch.apps.googleusercontent.com";

function LogIn(props) {
  const navigate = useNavigate();
  const isSignedIn = useSelector(state => state.user.isSignedIn);

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const onSubmit = (formValues) => {
    trackPromise(props.loginUser(formValues));
  };

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

  const login = async (response) => {
    const decoded = jwtDecode(response.credential);
    const ip = await fetchIpWithTimeout();
    props.googleLoginUser({
      google_id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      image_url: decoded.picture,
      ip_address: ip,
    });
  };

  return (
    <div className="col-sm-3 mx-auto">
      <br />
      <h3 className="text-center">Log In</h3>
      <br />
      <p className="text-danger">{props.errors}</p>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form id="loginForm" onSubmit={handleSubmit}>
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
              <button className="btn btn-primary col-sm-4">Log In</button>
            </div>
            <div className="text-center">
              <LoadingIndicator />
            </div>
          </form>
        )}
      />
      <br />
      <div className="text-center">
        <GoogleLogin
          onSuccess={async (response) => { await login(response); }}
          onError={handleLoginFailure}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errors: state.errors.userLoginError,
});

export default connect(mapStateToProps, { loginUser, googleLoginUser })(LogIn);
