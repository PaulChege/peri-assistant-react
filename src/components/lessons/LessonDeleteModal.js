import React from "react";
import Modal from "../Modal";
import { connect } from "react-redux";
import { getLesson, deleteLesson } from "../../actions/lessons";
import { useNavigate } from "react-router-dom";

function LessonDeleteModal(props) {
  const navigate = useNavigate();
  const { student, lesson, deleteLesson } = props;

  const handleDelete = () => {
    deleteLesson(student.id, lesson.id);
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

  return (
    <div>
      <Modal
        title="Delete Student"
        content="Are you sure you want to delete the lesson?"
        actions={renderActions()}
        id={props.id}
        onDismiss={handleDismiss}
      />
    </div>
  );
}

export default connect(null, { getLesson, deleteLesson })(LessonDeleteModal);
