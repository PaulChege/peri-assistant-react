import React, { useCallback, useEffect } from "react";
import LessonForm from "./LessonForm";
import { connect, useSelector } from "react-redux";
import { updateLesson, getLesson, clearLessonUpdateSuccess } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { getTime } from "../../helper";
import { trackPromise } from "react-promise-tracker";
import { useNavigate, useParams } from "react-router-dom";
import periAssistantApi from "../../api/periAssistantApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

function LessonEdit({ updateLesson, getStudent, clearLessonUpdateSuccess, student, errors }) {
  const navigate = useNavigate();
  const { studentId, id } = useParams();
  const lessonUpdated = useSelector(state => state.lessons.lessonUpdated);
  const [lesson, setLesson] = React.useState(null);
  const [metadata, setMetadata] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Fetch lesson details directly from API using new endpoint
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const response = await periAssistantApi.get(`/lessons/${id}`);
        setLesson(response.data.lesson);
        setMetadata(response.data.metadata);
        
        // If we have student info from the lesson, get the student details
        if (response.data.lesson && response.data.lesson.student && response.data.lesson.student.id) {
          getStudent(response.data.lesson.student.id);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
    clearLessonUpdateSuccess(); // Clear flag on mount
    return () => clearLessonUpdateSuccess(); // Clear flag on unmount
  }, [getStudent, id, clearLessonUpdateSuccess]);

  useEffect(() => {
    if (lessonUpdated) {
      // Navigate back to the lessons page, or to the student's lessons if we have student info
      if (lesson && lesson.student && lesson.student.id) {
        navigate(`/student/${lesson.student.id}/lessons`);
      } else {
        navigate('/lessons');
      }
    }
  }, [lessonUpdated, navigate, lesson]);

  const onSubmit = useCallback(async (formValues) => {
    // Get student ID from lesson data if available, otherwise use the URL param
    const studentIdToUse = lesson && lesson.student && lesson.student.id ? lesson.student.id : studentId;
    await trackPromise(updateLesson(studentIdToUse, id, formValues));
    // Do not navigate here!
  }, [updateLesson, lesson, studentId, id]);

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
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {metadata && metadata.student && (
        <div className="student-sticky-header">
          <h4 className="mb-1">{metadata.student.name}</h4>
          <div className="text-muted">{metadata.student.instruments}</div>
        </div>
      )}
      <div className="lesson-form-card" style={{ position: 'relative' }}>
        <LessonForm
          title="Lesson Details"
          onSubmit={onSubmit}
          errors={errors}
          initialValues={renderInitialValues()}
          currency={metadata && metadata.currency}
        />
      </div>
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
