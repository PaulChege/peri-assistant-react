import React, { useCallback, useEffect } from "react";
import LessonForm from "./LessonForm";
import { connect, useSelector } from "react-redux";
import { updateLesson, getLesson, clearLessonUpdateSuccess } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { getTime } from "../../helper";
import { trackPromise } from "react-promise-tracker";
import { useNavigate, useParams } from "react-router-dom";

function LessonEdit({ updateLesson, getLesson, getStudent, clearLessonUpdateSuccess, initialValues, student, errors }) {
  const navigate = useNavigate();
  const { studentId, id } = useParams();
  const lessonUpdated = useSelector(state => state.lessons.lessonUpdated);

  useEffect(() => {
    getStudent(studentId);
    getLesson(studentId, id);
    clearLessonUpdateSuccess(); // Clear flag on mount
    return () => clearLessonUpdateSuccess(); // Clear flag on unmount
  }, [getStudent, getLesson, studentId, id, clearLessonUpdateSuccess]);

  useEffect(() => {
    if (lessonUpdated) {
      navigate(`/student/${studentId}/lessons`);
    }
  }, [lessonUpdated, navigate, studentId]);

  const onSubmit = useCallback(async (formValues) => {
    await trackPromise(updateLesson(studentId, id, formValues));
    // Do not navigate here!
  }, [updateLesson, studentId, id]);

  const renderTitle = () => {
    if (student) {
      return `Edit Lesson for ${student.name}`;
    } else {
      return "Edit Lesson";
    }
  };

  const renderInitialValues = () => {
    if (initialValues) {
      return {
        ...initialValues,
        time: getTime(initialValues.time)
      };
    }
  };

  return (
    <LessonForm
      title={renderTitle()}
      onSubmit={onSubmit}
      errors={errors}
      initialValues={renderInitialValues()}
    />
  );
}

const mapStateToProps = (state, ownProps) => {
  const { studentId, id } = ownProps.match ? ownProps.match.params : {};
  return {
    initialValues: state.lessons.lessons.find(
      lesson => lesson.id === parseInt(id)
    ),
    student: state.students[studentId],
    errors: state.errors.lessonUpdateError
  };
};

export default connect(mapStateToProps, {
  updateLesson,
  getStudent,
  getLesson,
  clearLessonUpdateSuccess
})(LessonEdit);
