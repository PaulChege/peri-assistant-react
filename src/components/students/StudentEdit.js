import React, { useCallback, useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { updateStudent, getStudent, clearStudentUpdateSuccess } from "../../actions/students";
import { getInstrumentList } from "../../actions/instruments";
import { getUser } from "../../actions/users";
import StudentForm from "./StudentForm";
import { getTime } from "../../helper";
import { trackPromise } from "react-promise-tracker";
import { useNavigate, useParams } from "react-router-dom";
import periAssistantApi from "../../api/periAssistantApi";
import LoadingIndicator from "../LoadingIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function StudentEdit({ updateStudent, getInstrumentList, clearStudentUpdateSuccess, errors, instrumentList, currentUser, getUser }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const studentUpdated = useSelector(state => state.students.studentUpdated);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  useEffect(() => {
    getInstrumentList();
    if (!currentUser) getUser();
    setLoading(true);
    (async () => {
      try {
        const response = await periAssistantApi.get(`/students/${id}`);
        if (response.data) {
          setStudent(response.data);
        } else {
          setError('Student not found or invalid API response.');
        }
      } catch (err) {
        console.error('Failed to load student data:', err);
        setError('Failed to load student data.');
      } finally {
        setLoading(false);
      }
    })();
    clearStudentUpdateSuccess(); // Clear flag on mount
    return () => clearStudentUpdateSuccess(); // Clear flag on unmount
  }, [getInstrumentList, id, clearStudentUpdateSuccess, getUser, currentUser, refreshCount]);

  useEffect(() => {
    if (studentUpdated) {
      setSuccess(true);
      clearStudentUpdateSuccess();
      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, 2000);
    }
  }, [studentUpdated, clearStudentUpdateSuccess, navigate]);

  const onSubmit = useCallback(async (formValues) => {
    await trackPromise(updateStudent(id, formValues));
    // Do not navigate here!
  }, [updateStudent, id]);

  const handleRemoveStudent = async () => {
    try {
      await trackPromise(updateStudent(id, { status: 'inactive' }));
      setShowRemoveModal(false);
      // Navigate back to students list after successful removal
      navigate("/");
    } catch (err) {
      console.error('Failed to remove student:', err);
    }
  };

  const renderInitialValues = () => {
    if (student) {
      // Handle institution
      let homeLessons = false;
      let institutionValue = '';
      if (student.institution && typeof student.institution === 'object') {
        if (student.institution.name === 'Home') {
          homeLessons = true;
          institutionValue = 'Home';
        } else {
          institutionValue = student.institution.name  || '';
        }
      } else if (typeof student.institution === 'string') {
        institutionValue = student.institution;
        if (student.institution === 'Home') homeLessons = true;
      }

      // Handle schedule
      let schedule = {};
      if (Array.isArray(student.schedule)) {
        student.schedule.forEach((item) => {
          // Map day label to string key
          const dayKey = item.day ? item.day.toLowerCase() : null;
          if (dayKey && [
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
          ].includes(dayKey)) {
            // Convert UTC time to local time string (hh:mm)
            let localTime = '';
            if (item.start_time) {
              const [h, m] = item.start_time.split(':');
              const date = new Date();
              date.setUTCHours(Number(h), Number(m), 0, 0);
              localTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            }
            schedule[dayKey] = {
              enabled: true,
              start_time: localTime,
              duration: item.duration || ''
            };
          }
        });
      }

      // Handle instruments (comma-separated string to array)
      let instrumentsArr = [];
      if (student.instruments && typeof student.instruments === 'string') {
        instrumentsArr = student.instruments.split(',').map(i => i.trim()).filter(Boolean);
      }

      return {
        ...student,
        lesson_time: student.lesson_time,
        homeLessons,
        institution: institutionValue,
        schedule,
        instruments: instrumentsArr
      };
    }
  };

  const initialValues = renderInitialValues();

  if (loading || !initialValues) {
    return <div className="container" style={{ paddingTop: '2.5rem' }}><div>Loading student details...</div></div>;
  }
  if (error) {
    return <div className="container" style={{ paddingTop: '2.5rem' }}><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {success && !studentUpdated ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <div className="spinner-border" role="status"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="lesson-form-card">
            <StudentForm
              title="Edit Student"
              initialValues={initialValues}
              onSubmit={onSubmit}
              errors={errors}
              instrumentList={instrumentList}
              currentUser={currentUser}
            />
            
            {/* Remove Button */}
            <div className="row">
              <div className="col-sm-6">
                <div className="d-flex justify-content-center mt-5">
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowRemoveModal(true)}
                    style={{ 
                      minWidth: 80,
                      backgroundColor: '#dc3545',
                      borderColor: '#dc3545',
                      color: 'white',
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.5rem'
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Remove
                  </button>
                </div>
              </div>
              <div className="col-sm-6"></div>
            </div>
          </div>

          {/* Confirmation Modal */}
          {showRemoveModal && (
            <>
              <div 
                className="modal-backdrop fade show" 
                style={{ 
                  position: 'fixed', 
                  top: 0, 
                  left: 0, 
                  width: '100vw', 
                  height: '100vh', 
                  backgroundColor: 'rgba(0,0,0,0.5)', 
                  zIndex: 1040 
                }}
                onClick={() => setShowRemoveModal(false)}
              ></div>
              <div 
                className="modal fade show" 
                style={{ 
                  display: 'block', 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1050,
                  pointerEvents: 'none'
                }} 
                tabIndex="-1"
              >
                <div 
                  className="modal-dialog"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirm Removal</h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowRemoveModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to remove this student? </p>
                      <p className="text-muted small">The student will be marked as inactive and hidden from the main student list. You can always reactivate the student later.</p>
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowRemoveModal(false)}
                      >
                        Cancel
                      </button>
                                          <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={handleRemoveStudent}
                      style={{
                        backgroundColor: '#dc3545',
                        borderColor: '#dc3545',
                        color: 'white'
                      }}
                    >
                      Remove Student
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  errors: state.errors.studentUpdateError,
  instrumentList: state.instruments.instrumentList,
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps, {
  updateStudent,
  getInstrumentList,
  clearStudentUpdateSuccess,
  getUser
})(StudentEdit);
