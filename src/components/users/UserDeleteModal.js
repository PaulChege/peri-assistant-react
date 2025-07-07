import React from "react";
import Modal from "../Modal";
import { connect } from "react-redux";
import { deleteUser } from "../../actions/users";
import { useNavigate } from "react-router-dom";

function UserDeleteModal(props) {
  const navigate = useNavigate();
  const { deleteUser } = props;

  const handleDelete = () => {
    deleteUser();
    navigate("/user");
  };

  const handleDismiss = () => {
    navigate("/user");
  };

  const renderActions = () => (
    <>
      <button onClick={handleDelete} className="btn btn-danger">
        Delete
      </button>
      <button onClick={handleDismiss} className="btn btn-primary">
        Cancel
      </button>
    </>
  );

  return (
    <div>
      <Modal
        title="Delete Student"
        content="Are you sure you want to delete your account?"
        actions={renderActions()}
        id="userDeleteModal"
        onDismiss={handleDismiss}
      />
    </div>
  );
}

export default connect(null, { deleteUser })(UserDeleteModal);
