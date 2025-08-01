import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateStudent } from "../../actions/students";
import periAssistantApi from "../../api/periAssistantApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "../../styling/styles.css";

function RemovedStudents(props) {
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activatingStudents, setActivatingStudents] = useState(new Set());

  useEffect(() => {
    fetchInactiveStudents();
  }, []);

  const fetchInactiveStudents = async () => {
    try {
      setLoading(true);
      const response = await periAssistantApi.get('/students/inactive');
      setInactiveStudents(response.data || []);
    } catch (error) {
      console.error('Failed to fetch inactive students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateStudent = async (studentId) => {
    try {
      setActivatingStudents(prev => new Set(prev).add(studentId));
      await props.updateStudent(studentId, { status: 'active' });
      
      // Remove the student from the list after successful activation
      setInactiveStudents(prev => prev.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('Failed to activate student:', error);
    } finally {
      setActivatingStudents(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="container main-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <div className="spinner-border" role="status"></div>
            <div className="mt-2">Loading removed students...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container main-content">
      <h4>Removed Students</h4>
      
      {inactiveStudents.length === 0 ? (
        <div className="text-center text-muted" style={{ fontSize: '1.2em', padding: '2em 0' }}>
          No removed students found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                <th>Name</th>
                <th>Institution</th>
                <th>Instruments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inactiveStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>
                    {typeof student.institution === 'object' && student.institution !== null 
                      ? student.institution.name 
                      : student.institution}
                  </td>
                  <td>{student.instruments}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleActivateStudent(student.id)}
                      disabled={activatingStudents.has(student.id)}
                      style={{
                        minWidth: 100,
                        backgroundColor: activatingStudents.has(student.id) ? '#6c757d' : '#28a745',
                        borderColor: activatingStudents.has(student.id) ? '#6c757d' : '#28a745',
                        color: 'white'
                      }}
                    >
                      {activatingStudents.has(student.id) ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Activating...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheck} className="me-2" />
                          Activate
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { updateStudent })(RemovedStudents); 