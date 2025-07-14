import React, { useCallback, useEffect } from "react";
import LessonForm from "./LessonForm";
import { connect, useSelector } from "react-redux";
import { updateLesson, getLesson, clearLessonUpdateSuccess } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { getTime } from "../../helper";
import { trackPromise } from "react-promise-tracker";
import { useNavigate, useParams } from "react-router-dom";
import periAssistantApi from "../../api/periAssistantApi";

function LessonEdit({ updateLesson, getStudent, clearLessonUpdateSuccess, student, errors }) {
  const navigate = useNavigate();
  const { studentId, id } = useParams();
  const lessonUpdated = useSelector(state => state.lessons.lessonUpdated);
  const [lesson, setLesson] = React.useState(null);
  const [metadata, setMetadata] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getStudent(studentId);
    // Fetch lesson details directly from API
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const response = await periAssistantApi.get(`/students/${studentId}/lessons/${id}`);
        setLesson(response.data.lesson);
        setMetadata(response.data.metadata);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
    clearLessonUpdateSuccess(); // Clear flag on mount
    return () => clearLessonUpdateSuccess(); // Clear flag on unmount
  }, [getStudent, studentId, id, clearLessonUpdateSuccess]);

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
    if (lesson) {
      // Split date_time into day and time for the form UI
      let day = "";
      let time = "";
      if (lesson.date_time) {
        const dt = new Date(lesson.date_time);
        day = dt.toISOString().slice(0, 10); // yyyy-mm-dd
        time = dt.toTimeString().slice(0, 5); // hh:mm
      }
      return {
        ...lesson,
        day,
        time
      };
    }
  };

  if (loading) {
    return <div className="container"><br /><br /><div>Loading lesson details...</div></div>;
  }
  return (
    <div className="container">
      {metadata && metadata.student && (
        <div className="mb-3">
          <h4 className="mb-1">{metadata.student.name}</h4>
          <div className="text-muted">{metadata.student.instruments}</div>
        </div>
      )}
      <LessonForm
        title="Lesson Details"
        onSubmit={onSubmit}
        errors={errors}
        initialValues={renderInitialValues()}
        currency={metadata && metadata.currency}
      />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const { studentId } = ownProps.match ? ownProps.match.params : {};
  return {
    student: state.students[studentId],
    errors: state.errors.lessonUpdateError
  };
};

export default connect(mapStateToProps, {
  updateLesson,
  getStudent,
  clearLessonUpdateSuccess
})(LessonEdit);
