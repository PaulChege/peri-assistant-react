import React from "react";
import Modal from "../Modal";
import history from "../../history";
import { connect } from "react-redux";
import { deleteUser } from "../../actions/users";

class UserDeleteModal extends React.Component {
  renderActions() {
    return (
      <React.Fragment>
        <button
          onClick={() => {
            this.props.deleteUser();
          }}
          className="btn btn-danger"
        >
          Delete
        </button>
        <button
          // TODO - Find better way to close modal other than reloading
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Cancel
        </button>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div>
        <Modal
          title="Delete Student"
          content="Are you sure you want to delete your account?"
          actions={this.renderActions()}
          id="userDeleteModal"
          onDismiss={() => {
            history.push(`/user`);
          }}
        />
      </div>
    );
  }
}

export default connect(null, { deleteUser })(UserDeleteModal);
