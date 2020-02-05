import React from "react";
import { connect } from "react-redux";
import { getStudentList } from "../../actions/students";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import "../../styling/styles.css";

class StudentList extends React.Component {
  componentDidMount() {
    this.props.getStudentList();
  }

  render() {
    if (this.props.students) {
      return (
        <div className="container">
          <h4>Students{` (${this.props.students.length})`}</h4>
          <br />
          <Link
            to="/student/create"
            className="btn btn-outline-primary btn-sm float-right"
            style={this.buttonStyle}
          >
            <FontAwesomeIcon icon={faPlus} className="icon-padded" />
            Add Student
          </Link>
          <br />
          <br />
          <div className="row">
            {this.props.students.map(student => {
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
                      <p className="card-text">{student.instrument}</p>
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
      );
    }
    return <div>Loading...</div>;
  }
}
const mapStateToProps = state => {
  return {
    students: Object.values(state.students)
  };
};

export default connect(mapStateToProps, { getStudentList })(StudentList);
