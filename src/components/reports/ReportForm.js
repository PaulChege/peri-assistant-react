import React, { useState, useRef, useEffect } from "react";
import { Field, Form } from "react-final-form";
import LoadingIndicator from "../LoadingIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
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
      students: []
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

  renderTextarea(input, placeholder) {
    return (
      <div className="form-group mb-3">
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
          render={({ handleSubmit }) => (
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
                    render={({ input }) => this.renderTextarea(input, "Summary")}
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
          )}
        />
      </div>
    );
  }
}

export default ReportForm;
