import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { createUser } from "../../actions/users";

class UserCreate extends React.Component {
  onSubmit = formValues => {
    this.props.createUser(formValues);
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
        <h3>Sign Up</h3>
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
          <button className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.errors.userCreateError
  };
};

export default connect(mapStateToProps, { createUser })(
  reduxForm({ form: "userCreateForm" })(UserCreate)
);
