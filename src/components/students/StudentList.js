import React from "react";
import { connect } from "react-redux";
import { getStudentList } from "../../actions/students";
import periAssistantApi from "../../api/periAssistantApi";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faAlignJustify,
  faSearch,
  faEdit,
  faSyncAlt, // Add reset icon
  faFilter // Add filter icon
} from "@fortawesome/free-solid-svg-icons";
import "../../styling/styles.css";
import { Field, Form } from "react-final-form";

class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      institutions: [],
      selectedInstitution: "",
      instruments: [],
      selectedInstrument: ""
    };
  }

  componentDidMount() {
    this.props.getStudentList();
    periAssistantApi.get('/users/student_institutions').then((response) => {
      this.setState({ institutions: response.data });
    }).catch(() => {
      this.setState({ institutions: [] });
    });
    periAssistantApi.get('/users/student_instruments').then((response) => {
      this.setState({ instruments: response.data });
    }).catch(() => {
      this.setState({ instruments: [] });
    });
  }

  renderSerchForm() {
    return (
      <Form
        onSubmit={({ search }) => this.props.getStudentList(search, this.state.selectedInstitution, this.state.selectedInstrument)}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center flex-nowrap mb-2">
              <Field name="search" component="input" type="text"
                className="form-control form-control-sm rounded-pill shadow-sm border-0 me-2"
                style={{ maxWidth: 200 }}
                placeholder="Search students..."
              />
              <button className="btn btn-sm btn-primary me-2" type="submit">
                <FontAwesomeIcon icon={faSearch} className="icon-padded" />
                Search
              </button>
              <select
                className="form-select form-select-sm rounded-pill shadow-sm border-0 me-2 ms-4"
                value={this.state.selectedInstitution}
                onChange={e => this.setState({ selectedInstitution: e.target.value })}
                style={{ maxWidth: 180 }}
              >
                <option value="">All Institutions</option>
                {this.state.institutions.map((inst, idx) => (
                  <option key={idx} value={inst}>{inst}</option>
                ))}
              </select>
              <select
                className="form-select form-select-sm rounded-pill shadow-sm border-0 me-2"
                value={this.state.selectedInstrument}
                onChange={e => this.setState({ selectedInstrument: e.target.value })}
                style={{ maxWidth: 180 }}
              >
                <option value="" disabled>Select Instrument</option>
                {this.state.instruments.map((inst, idx) => (
                  <option key={idx} value={inst}>{inst}</option>
                ))}
              </select>
              <button
                className="btn btn-sm btn-info me-2"
                type="button"
                title="Filter by institution and instrument"
                onClick={() => this.props.getStudentList(
                  form.getFieldState('search')?.value || '',
                  this.state.selectedInstitution,
                  this.state.selectedInstrument
                )}
              >
                <FontAwesomeIcon icon={faFilter} className="icon-padded" />
                Filter
              </button>
              <button
                className="btn btn-sm btn-secondary ms-4"
                type="button"
                title="Reset search"
                onClick={() => {
                  form.reset();
                  this.setState({ selectedInstitution: "", selectedInstrument: "" });
                  this.props.getStudentList();
                }}
              >
                <FontAwesomeIcon icon={faSyncAlt} className="icon-padded" />
                Reset
              </button>
            </div>
          </form>
        )}
      />
    );
  }

  render() {
    return (
      this.props.students && (
        <div className="container main-content">
          <h4>Students{` (${this.props.students.length})`}</h4>
          <br />
          {this.renderSerchForm()}
          {/* Add Student button aligned right */}
          <div className="d-flex justify-content-end mb-3">
            <Link
              to="/student/create"
              className="btn btn-outline-primary btn-sm"
              style={this.buttonStyle}
            >
              <FontAwesomeIcon icon={faPlus} className="icon-padded" />
              Add Student
            </Link>
          </div>
          <br />
          <br />
          <div className="row">
            {this.props.students.length === 0 ? (
              <div className="col-12 text-center text-muted" style={{ fontSize: '1.2em', padding: '2em 0' }}>
                No results found
              </div>
            ) : (
              this.props.students.map((student) => {
                return (
                  <div
                    className="col-sm-3"
                    key={student.id}
                    style={{ paddingBottom: "25px" }}
                  >
                    <div className="card" style={{ position: 'relative' }}>
                      {/* Edit icon at top left */}
                      <Link
                        to={`/student/${student.id}/edit`}
                        className="btn btn-outline-secondary btn-sm"
                        title="Edit Student"
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          borderRadius: '50%',
                          padding: '4px 7px',
                          minWidth: 0,
                          minHeight: 0
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <div className="card-body">
                        <h5 className="card-title">{student.name}</h5>
                        <p className="card-text">{typeof student.institution === 'object' && student.institution !== null ? student.institution.name : student.institution}</p>
                        <p className="card-text">{student.instruments}</p>
                        {/* Schedule summary */}
                        {Array.isArray(student.schedule) && student.schedule.length > 0 && (
                          <p className="card-text" style={{ fontSize: '0.85em', color: '#666', marginBottom: '0.5em' }}>
                            {student.schedule.slice(0, 2).map((item, idx) => {
                              // Format: Mondays at 12:30
                              const day = item.day || '';
                              let time = '';
                              if (item.start_time) {
                                // Convert UTC to local time string (hh:mm)
                                const [h, m] = item.start_time.split(":");
                                const date = new Date();
                                date.setUTCHours(Number(h), Number(m), 0, 0);
                                time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                              }
                              return `${day}${time ? `s at ${time}` : ''}`;
                            }).join(', ')}
                            {student.schedule.length > 2 ? '…' : ''}
                          </p>
                        )}
                        <Link
                          to={`/student/${student.id}/lessons`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FontAwesomeIcon
                            icon={faAlignJustify}
                            className="icon-padded"
                          />
                          View Lessons
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )
    );
  }
}
const mapStateToProps = (state) => {
  return {
    students: Object.values(state.students).filter(student =>
      student && typeof student === 'object' &&
      Object.prototype.hasOwnProperty.call(student, 'id') &&
      typeof student.id === 'number'
    ),
  };
};

StudentList = connect(mapStateToProps, { getStudentList })(StudentList);
export default StudentList;
