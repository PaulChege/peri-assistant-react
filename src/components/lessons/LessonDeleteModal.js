import React from "react";
import Modal from "../Modal";
import { connect } from "react-redux";
import { getLesson, deleteLesson } from "../../actions/lessons";
import { useNavigate } from "react-router-dom";
import periAssistantApi from "../../api/periAssistantApi";

function LessonDeleteModal(props) {
  const navigate = useNavigate();
  const { student, lesson } = props;

  const handleDelete = async () => {
    if (!student || !lesson) return; // Guard clause
    try {
      await periAssistantApi.delete(`/students/${student.id}/lessons/${lesson.id}`);
      if (props.onRemoved) {
        props.onRemoved("Lesson removed successfully.");
      }
      navigate(`/student/${student.id}/lessons`);
    } catch (e) {
      console.log(e);
      if (props.onRemoved) {
        props.onRemoved("Failed to remove lesson.");
      }
    }
  };

  const handleDismiss = () => {
    navigate(`/student/${student.id}/lessons`);
  };

  const renderActions = () => (
    <>
      <button onClick={handleDelete} className="btn btn-danger">
        Remove
      </button>
      <button onClick={handleDismiss} className="btn btn-primary">
        Cancel
      </button>
    </>
  );

  return (
    <Modal
      show={props.show}
      title="Delete Student"
      content="Are you sure you want to delete the lesson?"
      actions={renderActions()}
      id={props.id}
      onDismiss={handleDismiss}
    />
  );
}

export default connect(null, { getLesson, deleteLesson })(LessonDeleteModal);
