import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { userCreate } from "../../actions";

class UserCreate extends React.Component {
  onSubmit = formValues => {
    this.props.userCreate(formValues);
  };
  render() {
    return (
      <div className="col-sm-5">
        <p className="text-danger">{this.props.errors}</p>
        <br />
        <h3>Sign Up</h3>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field
            name="name"
            component={({ input }) => (
              <div className="form-group">
                <input {...input} placeholder="Name" className="form-control" />
              </div>
            )}
          />
          <Field
            name="email"
            component={({ input }) => (
              <div className="form-group">
                <input
                  {...input}
                  placeholder="Email"
                  className="form-control"
                />
              </div>
            )}
          />
          <Field
            name="password"
            component={({ input }) => (
              <div className="form-group">
                <input
                  {...input}
                  type="password"
                  placeholder="Password"
                  className="form-control"
                />
              </div>
            )}
          />
          <button className="btn btn-primary">Sign Up</button>
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

export default connect(mapStateToProps, { userCreate })(
  reduxForm({ form: "userCreateForm" })(UserCreate)
);
