import React, { useEffect } from "react";
import Modal from "../Modal";
import { connect } from "react-redux";
import { getStudent, deleteStudent } from "../../actions/students";
import { useNavigate } from "react-router-dom";

function StudentDeleteModal(props) {
  const navigate = useNavigate();
  const { student, getStudent, deleteStudent } = props;

  useEffect(() => {
    getStudent(student.id);
    // eslint-disable-next-line
  }, [getStudent, student.id]);

  const handleDelete = () => {
    deleteStudent(student.id);
    navigate(`/student/${student.id}/lessons`);
  };

  const handleDismiss = () => {
    navigate(`/student/${student.id}/lessons`);
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

  const renderContent = () => {
    if (!student) {
      return "Are you sure you want to delete?";
    } else {
      return `Are you sure you want to delete the student: ${student.name}?`;
    }
  };

  return (
    <div>
      <Modal
        title="Delete Student"
        content={renderContent()}
        actions={renderActions()}
        id="studentDeleteModal"
        onDismiss={handleDismiss}
      />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    student: state.students[ownProps.student.id]
  };
};

export default connect(mapStateToProps, { getStudent, deleteStudent })(StudentDeleteModal);
