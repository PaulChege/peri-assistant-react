import React from "react";
import { connect } from "react-redux";
import { getStudentList } from "../../actions/students";

class StudentList extends React.Component {
  componentDidMount() {
    this.props.getStudentList();
  }
  render() {
    if (this.props.students) {
      return (
        <div className="col-sm-12">
          <h4>Students</h4>
          {this.props.students.map(student => {
            return <div key={student.id}>{student.name}</div>;
          })}
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
