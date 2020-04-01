import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { loginUser } from "../actions/users";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "./LoadingIndicator";

class LogIn extends React.Component {
  onSubmit = formValues => {
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
  render() {
    return (
      <div className="col-sm-4 mx-auto">
        <br />
        <h3>Log In</h3>
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
          <button className="btn btn-primary">Log In</button>
          <LoadingIndicator />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.errors.userLoginError
  };
};

export default connect(mapStateToProps, { loginUser })(
  reduxForm({ form: "userLogin" })(LogIn)
);
