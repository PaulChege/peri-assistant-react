import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllLessons, updateLesson } from "../../actions/lessons";
import periAssistantApi from "../../api/periAssistantApi";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "../../styling/styles.css";

function AllLessons(props) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [statusError, setStatusError] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState("");

  useEffect(() => {
    // Fetch institutions for filter
    periAssistantApi.get('/users/student_institutions').then((response) => {
      setInstitutions(response.data);
    }).catch(() => {
      setInstitutions([]);
    });

    // Fetch lessons on mount
    props.getAllLessons(selectedInstitution, pastPage, upcomingPage);
    setStatusError("");
    // eslint-disable-next-line
  }, [selectedInstitution, pastPage, upcomingPage]);

  // Tab and pagination handlers
  const handleTabClick = (tab) => setActiveTab(tab);
  const handleUpcomingPageChange = (page) => setUpcomingPage(page);
  const handlePastPageChange = (page) => setPastPage(page);
  const handleInstitutionChange = (institution) => {
    setSelectedInstitution(institution);
    setUpcomingPage(1);
    setPastPage(1);
  };

  // Helper to update lesson status
  const handleStatusChange = async (lessonId, newStatus) => {
    try {
      // Get the student ID from the lesson data
      const lesson = [...(props.upcoming_lessons?.lessons || []), ...(props.past_lessons?.lessons || [])]
        .find(l => l.id === lessonId);
      
      if (!lesson || !lesson.student || !lesson.student.id) {
        setStatusError('Student information not available');
        return;
      }

      await props.updateLesson(lesson.student.id, lessonId, { status: newStatus });
      props.getAllLessons(selectedInstitution, pastPage, upcomingPage);
      setStatusError("");
    } catch (err) {
      console.error('Status update error:', err);
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
      // Get the student ID from the lesson data
      const lesson = [...(props.upcoming_lessons?.lessons || []), ...(props.past_lessons?.lessons || [])]
        .find(l => l.id === lessonId);
      
      if (!lesson || !lesson.student || !lesson.student.id) {
        setStatusError('Student information not available');
        return;
      }

      console.log('Updating paid status:', { lessonId, newPaid, studentId: lesson.student.id }); // Debug log
      await props.updateLesson(lesson.student.id, lessonId, { paid: newPaid === 'yes' });
      props.getAllLessons(selectedInstitution, pastPage, upcomingPage);
      setStatusError("");
    } catch (err) {
      console.error('Paid status update error:', err);
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
            <th style={{ whiteSpace: 'nowrap' }}>Student</th>
            <th style={{ whiteSpace: 'nowrap' }}>Institution</th>
            <th style={{ whiteSpace: 'nowrap' }}>Date</th>
            <th style={{ whiteSpace: 'nowrap' }}>Time</th>
            <th style={{ whiteSpace: 'nowrap' }}>Duration (min)</th>
            <th style={{ whiteSpace: 'nowrap' }}>Attendance</th>
            <th style={{ whiteSpace: 'nowrap' }}>Paid</th>
            <th style={{ whiteSpace: 'nowrap' }}>Charge{props.metadata && props.metadata.currency ? ` (${props.metadata.currency})` : ''}</th>
            <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
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
              // Use 24-hour format, user's local timezone
              localTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            }
            return (
              <tr key={lesson.id}>
                <td>
                  <Link to={`/student/${lesson.student?.id}/lessons`} className="text-decoration-none">
                    {lesson.student?.name || 'Unknown Student'}
                  </Link>
                </td>
                <td>
                  <span title={lesson.institution?.name || ''} style={{ maxWidth: '150px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lesson.institution?.name || ''}
                  </span>
                </td>
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
                    to={`/lesson/${lesson.id}/edit`}
                    className="btn btn-primary btn-sm"
                  >
                    Details
                  </Link>
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

  return (
    <div className="container main-content">
      <h4>Lessons</h4>
      <p className="text-danger">{props.errors}</p>
      {statusError && <div className="alert alert-danger" style={{ marginBottom: 10 }}>{statusError}</div>}
      <br />
      
      {/* Institution Filter */}
      <div className="d-flex align-items-center mb-3">
        <select
          className="form-select form-select-sm rounded-pill shadow-sm border-0"
          value={selectedInstitution}
          onChange={e => handleInstitutionChange(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="">All Institutions</option>
          {institutions.map((inst, idx) => (
            <option key={idx} value={inst}>{inst}</option>
          ))}
        </select>
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
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errors: state.errors.lessonUpdateError,
    upcoming_lessons: state.lessons.upcoming_lessons,
    past_lessons: state.lessons.past_lessons,
    metadata: state.lessons.metadata,
  };
};

export default connect(mapStateToProps, { getAllLessons, updateLesson })(AllLessons); 