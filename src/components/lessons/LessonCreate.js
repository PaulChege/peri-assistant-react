import React, { useCallback, useEffect } from "react";
import LessonForm from "./LessonForm";
import { connect, useSelector } from "react-redux";
import { createLesson, clearLessonCreateSuccess } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { getTime, getDateFromDay } from "../../helper";
import { trackPromise } from "react-promise-tracker";
import { useNavigate, useParams } from "react-router-dom";

function LessonCreate({ createLesson, getStudent, clearLessonCreateSuccess, student, errors }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const lessonCreated = useSelector(state => state.lessons.lessonCreated);

  useEffect(() => {
    getStudent(id);
    clearLessonCreateSuccess(); // Clear flag on mount
    return () => clearLessonCreateSuccess(); // Clear flag on unmount
  }, [getStudent, id, clearLessonCreateSuccess]);

  useEffect(() => {
    if (lessonCreated) {
      navigate(`/student/${id}/lessons`);
    }
  }, [lessonCreated, navigate, id]);

  const onSubmit = useCallback(async (formValues) => {
    await trackPromise(createLesson(id, formValues));
    // Do not navigate here!
  }, [createLesson, id]);

  const renderInitialValues = () => {
    if (student) {
      return {
        day: getDateFromDay(student.lesson_day),
        paid: false,
        duration: student.lesson_duration,
        charge: student.lesson_charge,
        time: getTime(student.lesson_time)
      };
    }
  };

  const renderTitle = () => {
    if (student) {
      return `Add Lesson for ${student.name}`;
    } else {
      return "Add Lesson";
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
  const { id } = ownProps.match ? ownProps.match.params : {};
  return {
    student: state.students[id],
    errors: state.errors.lessonCreateError
  };
};

export default connect(mapStateToProps, { createLesson, getStudent, clearLessonCreateSuccess })(LessonCreate);
