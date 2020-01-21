import React from "react";
import Modal from "../Modal";
import history from "../../history";
import { connect } from "react-redux";
import { getStudent, deleteStudent } from "../../actions/students";

class DeleteModal extends React.Component {
  componentDidMount() {
    this.props.getStudent(this.props.student.id);
  }
  renderActions() {
    const { id } = this.props.student;
    return (
      <React.Fragment>
        <button
          onClick={() => {
            this.props.deleteStudent(id);
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

  renderContent() {
    if (!this.props.student) {
      return "Are you sure you want to delete?";
    } else {
      return `Are you sure you want to delete the student: ${this.props.student.name}?`;
    }
  }

  render() {
    return (
      <div>
        <Modal
          title="Delete Student"
          content={this.renderContent()}
          actions={this.renderActions()}
          onDismiss={() => {
            history.push(`/student/${this.props.student.id}/lessons`);
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    student: state.students[ownProps.student.id]
  };
};

export default connect(mapStateToProps, { getStudent, deleteStudent })(
  DeleteModal
);
