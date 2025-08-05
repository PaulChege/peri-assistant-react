import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import periAssistantApi from "../../api/periAssistantApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LoadingIndicator from "../LoadingIndicator";
import "../../styling/styles.css";

function BreakCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    breakable_type: "Institution",
    breakable_id: "",
    start_date: "",
    end_date: ""
  });
  const [institutions, setInstitutions] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [institutionsResponse, studentsResponse, userResponse] = await Promise.all([
        periAssistantApi.get('/breaks/user_institutions'),
        periAssistantApi.get('/breaks/user_students'),
        periAssistantApi.get('/user')
      ]);
      
      setInstitutions(institutionsResponse.data || []);
      setStudents(studentsResponse.data || []);
      setCurrentUser(userResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.start_date || !formData.end_date) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.start_date >= formData.end_date) {
      setError('End date must be after start date');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const submitData = {
        breakable_type: formData.breakable_type === "Myself" ? "User" : formData.breakable_type,
        breakable_id: formData.breakable_type === "Myself" ? currentUser.id : formData.breakable_id,
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      await periAssistantApi.post('/breaks', submitData);
      navigate('/breaks');
    } catch (error) {
      console.error('Failed to create break:', error);
      setError(error.response?.data?.message || 'Failed to create break');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset breakable_id when type changes
    if (field === 'breakable_type') {
      setFormData(prev => ({
        ...prev,
        breakable_id: ""
      }));
    }
  };

  const getBreakableOptions = () => {
    switch (formData.breakable_type) {
      case "Institution":
        return institutions.map(inst => ({
          id: inst.id,
          name: inst.name
        }));
      case "Student":
        return students.map(student => ({
          id: student.id,
          name: student.name
        }));
      case "Myself":
        return [];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="container main-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <div className="spinner-border" role="status"></div>
            <div className="mt-2">Loading form data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Create Break</h4>
        <Link
          to="/breaks"
          className="btn btn-outline-secondary btn-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Breaks
        </Link>
      </div>

      <div className="lesson-form-card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group mb-3">
                <label htmlFor="breakable_type" className="form-label">
                  Who's taking a break? *
                </label>
                <select
                  id="breakable_type"
                  className="form-select"
                  value={formData.breakable_type}
                  onChange={(e) => handleInputChange('breakable_type', e.target.value)}
                  required
                >
                  <option value="Institution">Institution</option>
                  <option value="Student">Student</option>
                  <option value="Myself">Myself</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group mb-3">
                <label htmlFor="breakable_id" className="form-label">
                  {formData.breakable_type === "Institution" ? "Institution" : 
                   formData.breakable_type === "Student" ? "Student" : ""}
                </label>
                {formData.breakable_type === "Myself" ? (
                  <input
                    type="text"
                    className="form-control"
                    value="Personal Break"
                    disabled
                  />
                ) : (
                  <select
                    id="breakable_id"
                    className="form-select"
                    value={formData.breakable_id}
                    onChange={(e) => handleInputChange('breakable_id', e.target.value)}
                    required={formData.breakable_type !== "Myself"}
                  >
                    <option value="">Select {formData.breakable_type.toLowerCase()}</option>
                    {getBreakableOptions().map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group mb-3">
                <label htmlFor="start_date" className="form-label">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="start_date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group mb-3">
                <label htmlFor="end_date" className="form-label">
                  End Date *
                </label>
                <input
                  type="date"
                  id="end_date"
                  className="form-control"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <LoadingIndicator />
          
          <div className="row">
            <div className="col-sm-6">
              <div className="d-flex justify-content-center mt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ minWidth: 140 }}
                  disabled={submitting}
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  {submitting ? 'Creating...' : 'Create Break'}
                </button>
              </div>
            </div>
            <div className="col-sm-6"></div>
          </div>
        </form>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(BreakCreate); 