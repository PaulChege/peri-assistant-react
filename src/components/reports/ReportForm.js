import React, { useState, useRef, useEffect } from "react";
import { Field, Form } from "react-final-form";
import LoadingIndicator from "../LoadingIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faMagic } from "@fortawesome/free-solid-svg-icons";
import periAssistantApi from "../../api/periAssistantApi";

function StudentDropdown({ input, students }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (student) => {
    input.onChange(student.id);
    setOpen(false);
  };

  const selectedStudent = students.find(s => s.id === input.value);
  const label = selectedStudent ? selectedStudent.name : "Select a student";

  return (
    <div className="form-group mb-3" ref={dropdownRef} style={{ position: "relative" }}>
      <label className="form-label">Student</label>
      <div
        className="form-control"
        style={{ cursor: "pointer", minHeight: 38, userSelect: "none" }}
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
      >
        {label}
        <span style={{ float: "right" }}>&#9662;</span>
      </div>
      {open && (
        <div
          className="dropdown-menu show"
          style={{ display: "block", position: "absolute", width: "100%", zIndex: 1000, maxHeight: 200, overflowY: "auto" }}
        >
          {students.map((student) => (
            <div
              key={student.id}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelect(student)}
            >
              {student.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

class ReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      isGenerating: false
    };
  }

  componentDidMount() {
    this.fetchStudents();
  }

  fetchStudents = async () => {
    try {
      const response = await periAssistantApi.get('/users/students');
      this.setState({ students: response.data || [] });
    } catch (error) {
      console.error('Error fetching students:', error);
      this.setState({ students: [] });
    }
  };

  generateSummary = async (studentId, startDate, endDate, form) => {
    if (!studentId || !startDate || !endDate) {
      return;
    }

    this.setState({ isGenerating: true });
    
    try {
      const response = await periAssistantApi.post('/reports/generate', {
        student_id: studentId,
        start_date: startDate,
        end_date: endDate
      });
      
      if (response.data && response.data.summary) {
        form.change('summary', response.data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      // You might want to show an error message to the user here
    } finally {
      this.setState({ isGenerating: false });
    }
  };

  renderForm(input, placeholder, type = "") {
    return (
      <div className="form-group mb-3">
        <input
          {...input}
          placeholder={placeholder}
          type={type}
          className="form-control"
        />
      </div>
    );
  }

  renderDateField(input, label) {
    return (
      <div className="form-group mb-3">
        <label className="form-label">{label}</label>
        <input
          {...input}
          type="date"
          className="form-control"
        />
      </div>
    );
  }

  renderTextarea(input, placeholder, form, canGenerate = false, onGenerate = null) {
    return (
      <div className="form-group mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="form-label mb-0">Summary</label>
          {canGenerate && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={onGenerate}
              disabled={this.state.isGenerating}
            >
              <FontAwesomeIcon icon={faMagic} className="me-1" />
              {this.state.isGenerating ? 'Generating...' : 'AI Generate'}
            </button>
          )}
        </div>
        <textarea
          {...input}
          placeholder={placeholder}
          className="form-control"
          rows="4"
        />
      </div>
    );
  }

  handleSubmit = (values) => {
    this.props.onSubmit(values);
  };

  render() {
    return (
      <div className="container">
        <br />
        <br />
        <h5>{this.props.title}</h5>
        <p className="text-danger">{this.props.errors}</p>
        <Form
          onSubmit={this.handleSubmit}
          initialValues={this.props.initialValues}
          key={JSON.stringify(this.props.initialValues)}
          enableReinitialize={true}
          render={({ handleSubmit, form, values }) => {
            const canGenerate = values.student_id && values.start_date && values.end_date;
            console.log('Form values:', values);
            console.log('Can generate:', canGenerate);
            
            return (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-6">
                    <Field
                      name="student_id"
                      render={({ input }) => (
                        <StudentDropdown input={input} students={this.state.students} />
                      )}
                    />
                    <Field
                      name="start_date"
                      render={({ input }) => this.renderDateField(input, "Start Date")}
                    />
                    <Field
                      name="end_date"
                      render={({ input }) => this.renderDateField(input, "End Date")}
                    />
                    <Field
                      name="summary"
                      render={({ input }) => this.renderTextarea(
                        input, 
                        "Summary", 
                        form, 
                        canGenerate,
                        () => this.generateSummary(values.student_id, values.start_date, values.end_date, form)
                      )}
                    />
                  </div>
                </div>
                <br />
                <LoadingIndicator />
                <div className="row">
                  <div className="col-sm-6">
                    <div className="d-flex justify-content-center mt-4">
                      <button className="btn btn-primary" style={{ minWidth: 140 }}>
                        <FontAwesomeIcon icon={faSave} className="me-2" />
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-6"></div>
                </div>
              </form>
            );
          }}
        />
      </div>
    );
  }
}

export default ReportForm;
