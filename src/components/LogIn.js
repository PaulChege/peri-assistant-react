import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { loginUser, googleLoginUser } from "../actions/users";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "./LoadingIndicator";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID =
  "420797426729-kn0ggevqk789epdaic6mgev40gg0e5ch.apps.googleusercontent.com";

class LogIn extends React.Component {
  onSubmit = (formValues) => {
    trackPromise(this.props.loginUser(formValues));
  };

  renderForm(input, placeholder, type = "") {
    return (
      <div className="form-group">
        <input
          {...input}
          placeholder={placeholder}
          type={type}
          className="form-control"
        />
      </div>
    );
  }
  handleLoginFailure(response) {
    console.log(response);
  }
  login = (response) => {
    this.props.googleLoginUser({
      google_id: response.profileObj.googleId,
      name: response.profileObj.name,
      email: response.profileObj.email,
      image_url: response.profileObj.imageUrl,
    });
  };

  render() {
    return (
      <div className="col-sm-3 mx-auto">
        <br />
        <h3 className="text-center">Log In</h3>
        <br />
        <p className="text-danger">{this.props.errors}</p>
        <form id="loginForm" onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field
            name="email"
            component={({ input }) => this.renderForm(input, "Email", "email")}
          />
          <Field
            name="password"
            component={({ input }) =>
              this.renderForm(input, "Password", "password")
            }
          />
          <div className="text-center">
            <button className="btn btn-primary col-sm-4">Log In</button>
          </div>

          <div className="text-center">
            <LoadingIndicator />
          </div>
        </form>
        <br />
        <div className="text-center">
          <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Sign in with Google"
            onSuccess={this.login}
            onFailure={this.handleLoginFailure}
            cookiePolicy={"single_host_origin"}
            responseType="code,token"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errors: state.errors.userLoginError,
  };
};

export default connect(mapStateToProps, { loginUser, googleLoginUser })(
  reduxForm({ form: "userLogin" })(LogIn)
);
