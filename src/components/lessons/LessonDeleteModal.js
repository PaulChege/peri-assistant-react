import React from "react";
import Modal from "../Modal";
import history from "../../history";
import { connect } from "react-redux";
import { getLesson, deleteLesson } from "../../actions/lessons";

class LessonDeleteModal extends React.Component {
  renderActions() {
    return (
      <React.Fragment>
        <button
          onClick={() => {
            this.props.deleteLesson(
              this.props.student.id,
              this.props.lesson.id
            );
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
          content="Are you sure you want to delete the lesson?"
          actions={this.renderActions()}
          id={this.props.id}
          onDismiss={() => {
            history.push(`/student/${this.props.student.id}/lessons`);
          }}
        />
      </div>
    );
  }
}

export default connect(null, { getLesson, deleteLesson })(LessonDeleteModal);
