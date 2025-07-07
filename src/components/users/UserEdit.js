import React, { useEffect, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { connect, useSelector } from "react-redux";
import { updateUser, getUser, clearUserEditSuccess } from "../../actions/users";
import UserDeleteModal from "../users/UserDeleteModal";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "../LoadingIndicator";
import { useNavigate } from "react-router-dom";

function UserEdit({ updateUser, getUser, clearUserEditSuccess, initialValues, errors }) {
  const navigate = useNavigate();
  const userUpdated = useSelector(state => state.user.userUpdated);

  useEffect(() => {
    getUser();
    clearUserEditSuccess(); // Clear flag on mount
    return () => clearUserEditSuccess(); // Clear flag on unmount
  }, [getUser, clearUserEditSuccess]);

  useEffect(() => {
    if (userUpdated) {
      navigate("/");
    }
  }, [userUpdated, navigate]);

  const onSubmit = useCallback(async (formValues) => {
    await trackPromise(updateUser(formValues));
    // Do not navigate here!
  }, [updateUser]);

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

  const onClose = e => {
    // If you need to handle modal close
  };

  return (
    <div className="col-sm-4 mx-auto">
      <br />
      <h4>Account Details</h4>
      <br />
      <label>Email: </label>
      <p>
        <i>
          {initialValues ? initialValues.email : ""}
        </i>
      </p>
      <p className="text-danger">{errors}</p>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <Field
              name="name"
              render={({ input }) => renderForm(input, "Name")}
            />
            <button className="btn btn-primary">Save</button>
            <LoadingIndicator />
          </form>
        )}
      />
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
      <UserDeleteModal onClose={onClose} />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    initialValues: state.user.currentUser,
    errors: state.errors.userEditError
  };
};

export default connect(mapStateToProps, { updateUser, getUser, clearUserEditSuccess })(UserEdit);
