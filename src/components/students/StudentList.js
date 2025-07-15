import React from "react";
import { connect } from "react-redux";
import { getStudentList } from "../../actions/students";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faAlignJustify,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "../../styling/styles.css";
import { Field, Form } from "react-final-form";

class StudentList extends React.Component {
  componentDidMount() {
    this.props.getStudentList();
  }

  renderSerchForm() {
    return (
      <Form
        onSubmit={({ search }) => this.props.getStudentList(search)}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <Field name="search" component="input" type="text" />
                <button className="btn btn-sm btn-primary">
                  <FontAwesomeIcon icon={faSearch} className="icon-padded" />
                  Search
                </button>
              </div>
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
            {this.props.students.map((student) => {
              return (
                <div
                  className="col-sm-3"
                  key={student.id}
                  style={{ paddingBottom: "25px" }}
                >
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{student.name}</h5>
                      <p className="card-text">{student.institution}</p>
                      <p className="card-text">{student.instruments}</p>
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
            })}
          </div>
        </div>
      )
    );
  }
}
const mapStateToProps = (state) => {
  return {
    students: Object.values(state.students).filter(student => student && student.id !== undefined),
  };
};

StudentList = connect(mapStateToProps, { getStudentList })(StudentList);
export default StudentList;
