import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { updateUser, getUser } from "../../actions/users";
import UserDeleteModal from "../users/UserDeleteModal";

class UserEdit extends React.Component {
  componentDidMount() {
    this.props.getUser();
  }
  onSubmit = formValues => {
    this.props.updateUser(formValues);
  };
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
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
        <h4>Account Details</h4>
        <br />
        <label>Email: </label>
        <p>
          <i>
            {this.props.initialValues ? this.props.initialValues.email : ""}
          </i>
        </p>
        <p className="text-danger">{this.props.errors}</p>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <label>Name:</label>
          <Field
            name="name"
            component={({ input }) => this.renderForm(input, "Name")}
          />
          <button className="btn btn-primary">Save</button>
        </form>
        <br />
        <br />
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          data-toggle="modal"
          data-target="#userDeleteModal"
        >
          Delete Account
        </button>
        <UserDeleteModal onClose={this.onClose} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    initialValues: state.user.currentUser,
    errors: state.errors.userEditError
  };
};

export default connect(mapStateToProps, { updateUser, getUser })(
  reduxForm({ form: "userEditForm" })(UserEdit)
);
