import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getLessonList, sendPaymentReminders } from "../../actions/lessons";
import periAssistantApi from "../../api/periAssistantApi";
import { getStudent } from "../../actions/students";
import { Link, useParams } from "react-router-dom";
import StudentShow from "../students/StudentShow";
import { getTime, getReadableDate } from "../../helper";
import LessonDeleteModal from "./LessonDeleteModal";
import "../../styling/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMoneyBill, faChevronDown } from "@fortawesome/free-solid-svg-icons";

function LessonList(props) {
  const { id } = useParams();
  const buttonStyle = { color: "white" };
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [statusError, setStatusError] = useState("");
  const [removeMessage, setRemoveMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLesson, setDeleteLesson] = useState(null);

  useEffect(() => {
    props.getStudent(id);
    // Fetch both lists on mount or id change
    props.getLessonList(id, pastPage, upcomingPage);
    setStatusError(""); // Clear error on tab/page change
    // eslint-disable-next-line
  }, [id, pastPage, upcomingPage]);

  const sendPaymentReminders = () => {
    props.sendPaymentReminders(id);
  };

  // Tab and pagination handlers
  const handleTabClick = (tab) => setActiveTab(tab);
  const handleUpcomingPageChange = (page) => setUpcomingPage(page);
  const handlePastPageChange = (page) => setPastPage(page);

  // Helper to update lesson status
  const handleStatusChange = async (lessonId, newStatus) => {
    try {
      const studentId = props.student?.id || id;
      await periAssistantApi.put(`/students/${studentId}/lessons/${lessonId}`, { lesson: { status: newStatus } });
      props.getLessonList(id, pastPage, upcomingPage);
      setStatusError("");
    } catch (err) {
      if (err.response && err.response.status === 422 && err.response.data && err.response.data.message) {
        setStatusError(err.response.data.message);
      } else {
        setStatusError('Failed to update status');
      }
    }
  };

  // Helper to update lesson paid status
  const handlePaidChange = async (lessonId, newPaid) => {
    try {
      const studentId = props.student?.id || id;
      await periAssistantApi.put(`/students/${studentId}/lessons/${lessonId}`, { lesson: { paid: newPaid === 'yes' } });
      props.getLessonList(id, pastPage, upcomingPage);
      setStatusError("");
    } catch (err) {
      if (err.response && err.response.status === 422 && err.response.data && err.response.data.message) {
        setStatusError(err.response.data.message);
      } else {
        setStatusError('Failed to update paid status');
      }
    }
  };

  // Helper to format date as 'Mon, 1st Jan 2025'
  function formatPrettyDate(date) {
    if (!date) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(date);
    const dayOfWeek = days[d.getDay()];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    // Ordinal suffix
    const j = day % 10, k = day % 100;
    let suffix = 'th';
    if (j === 1 && k !== 11) suffix = 'st';
    else if (j === 2 && k !== 12) suffix = 'nd';
    else if (j === 3 && k !== 13) suffix = 'rd';
    return `${dayOfWeek}, ${day}${suffix} ${month} ${year}`;
  }

  // Helper to render lessons table
  const renderLessonsTable = (lessons) => {
    return (
      <table className="table table-bordered table-responsive-sm table-sm table-auto" style={{ tableLayout: 'auto' }}>
        <thead className="thead-light">
          <tr>
            <th style={{ whiteSpace: 'nowrap' }}>Date</th>
            <th style={{ whiteSpace: 'nowrap' }}>Time</th>
            <th style={{ whiteSpace: 'nowrap' }}>Duration (min)</th>
            <th style={{ whiteSpace: 'nowrap' }}>Status</th>
            <th style={{ whiteSpace: 'nowrap' }}>Paid</th>
            <th style={{ whiteSpace: 'nowrap' }}>Charge{props.metadata && props.metadata.currency ? ` (${props.metadata.currency})` : ''}</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => {
            if (!lesson) return null; // Guard against undefined lessons
            let localDate = "";
            let localTime = "";
            if (lesson.date_time) {
              const dt = new Date(lesson.date_time);
              localDate = formatPrettyDate(dt);
              localTime = dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
            }
            return (
              <tr key={lesson.id}>
                <td>{localDate}</td>
                <td>{localTime}</td>
                <td>{lesson.duration}</td>
                <td>
                  <div style={{ position: 'relative', minWidth: 110 }}>
                    <select
                      className="form-control form-control-sm"
                      value={lesson.status || ""}
                      onChange={e => handleStatusChange(lesson.id, e.target.value)}
                      style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: 24 }}
                    >
                      <option value=""></option>
                      <option value="attended">Attended</option>
                      <option value="missed">Missed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }} />
                  </div>
                </td>
                <td>
                  <div style={{ position: 'relative', minWidth: 70 }}>
                    <select
                      className="form-control form-control-sm"
                      value={lesson.paid ? 'yes' : 'no'}
                      onChange={e => handlePaidChange(lesson.id, e.target.value)}
                      style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: 24 }}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }} />
                  </div>
                </td>
                <td>{lesson.charge}</td>
                <td>
                  <Link
                    to={`/student/${id}/lesson/${lesson.id}/edit`}
                    className="btn btn-primary btn-sm"
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mx-sm-3"
                    onClick={() => {
                      setDeleteLesson(lesson);
                      setShowDeleteModal(true);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Pagination controls
  const renderPagination = (currentPage, totalPages, onPageChange) => (
    <nav>
      <ul className="pagination pagination-sm">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page} className={`page-item${page === currentPage ? " active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>{page}</button>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Get lessons and pagination info from props
  const upcoming = props.upcoming_lessons || { lessons: [], current_page: 1, total_pages: 1 };
  const past = props.past_lessons || { lessons: [], current_page: 1, total_pages: 1 };

  // Remove loading check for props.student
  // Always render the main content and modal
  return (
    <div className="container">
      {removeMessage && <div className="alert alert-info" style={{ marginBottom: 10 }}>{removeMessage}</div>}
      {props.metadata && props.metadata.student && (
        <div className="mb-3">
          <h4 className="mb-1">{props.metadata.student.name}</h4>
          <div className="text-muted">{props.metadata.student.instruments}</div>
        </div>
      )}
      <p className="text-danger">{props.errors}</p>
      {statusError && <div className="alert alert-danger" style={{ marginBottom: 10 }}>{statusError}</div>}
      <StudentShow student={props.student} />
      <br />
      <div className="d-flex justify-content-end mb-3">
        <Link
          to={`/student/${id}/lessons/create`}
          className="btn btn-outline-primary btn-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="icon-padded" />
          Add Lesson
        </Link>
      </div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link${activeTab === "upcoming" ? " active" : ""}`}
            onClick={() => handleTabClick("upcoming")}
          >
            Upcoming Lessons
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link${activeTab === "past" ? " active" : ""}`}
            onClick={() => handleTabClick("past")}
          >
            Past Lessons
          </button>
        </li>
      </ul>
      <div className="tab-content mt-3">
        {activeTab === "upcoming" && (
          <div>
            {renderLessonsTable(upcoming.lessons || [])}
            {renderPagination(upcoming.current_page || 1, upcoming.total_pages || 1, handleUpcomingPageChange)}
          </div>
        )}
        {activeTab === "past" && (
          <div>
            {renderLessonsTable(past.lessons || [])}
            {renderPagination(past.current_page || 1, past.total_pages || 1, handlePastPageChange)}
          </div>
        )}
      </div>
      {/* Always render LessonDeleteModal, regardless of student/lesson state */}
      <LessonDeleteModal
        student={props.student}
        lesson={deleteLesson}
        id="lessonDeleteModal"
        onRemoved={msg => { setRemoveMessage(msg); setShowDeleteModal(false); }}
        onClose={() => setShowDeleteModal(false)}
        show={showDeleteModal}
      />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id;
  return {
    errors: state.errors.paymentReminderError,
    upcoming_lessons: state.lessons.upcoming_lessons,
    past_lessons: state.lessons.past_lessons,
    student: state.students[id],
    metadata: state.lessons.metadata,
  };
};
export default connect(mapStateToProps, {
  getLessonList,
  getStudent,
  sendPaymentReminders,
})(props => {
  const params = useParams();
  return <LessonList {...props} id={params.id} />;
});
