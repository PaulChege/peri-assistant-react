import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { createUser, googleLoginUser } from "../../actions/users";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "../LoadingIndicator";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID =
  "420797426729-kn0ggevqk789epdaic6mgev40gg0e5ch.apps.googleusercontent.com";

class UserCreate extends React.Component {
  onSubmit = (formValues) => {
    trackPromise(this.props.createUser(formValues));
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
        <h3 className="text-center">Sign Up</h3>
        <p className="text-danger">{this.props.errors}</p>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field
            name="name"
            component={({ input }) => this.renderForm(input, "Name")}
          />
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
            {" "}
            <button className="btn btn-primary">Sign Up</button>
          </div>
          <div className="text-center">
            <LoadingIndicator />
          </div>
          <br />
          <div className="text-center">
            <GoogleLogin
              clientId={CLIENT_ID}
              buttonText="Sign Up with Google"
              onSuccess={this.login}
              onFailure={this.handleLoginFailure}
              cookiePolicy={"single_host_origin"}
              responseType="code,token"
            />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errors: state.errors.userCreateError,
  };
};

export default connect(mapStateToProps, { createUser, googleLoginUser })(
  reduxForm({ form: "userCreateForm" })(UserCreate)
);
