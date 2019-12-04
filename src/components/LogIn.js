import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { userLogin } from "../actions";

class LogIn extends React.Component {
  onSubmit = formValues => {
    this.props.userLogin(formValues);
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
      <div className="col-sm-5">
        <h3>Log In</h3>
        <p className="text-danger">{this.props.errors}</p>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
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
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.user.errors
  };
};

export default connect(mapStateToProps, { userLogin })(
  reduxForm({ form: "userLogin" })(LogIn)
);
