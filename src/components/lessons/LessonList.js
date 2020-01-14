import React from "react";
import { connect } from "react-redux";
import { getLessonList } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { Link } from "react-router-dom";
import StudentShow from "../students/StudentShow";

class LessonList extends React.Component {
  componentDidMount() {
    this.props.getStudent(this.props.match.params.id);
    this.props.getLessonList(this.props.match.params.id);
  }
  render() {
    return (
      <div className="container">
        <StudentShow student={this.props.student} />
        <br />
        <Link
          to={`/student/${this.props.match.params.id}/lessons/create`}
          className="btn btn-primary"
        >
          Add Lesson
        </Link>
        <br />
        <br />
        <h5>Lessons</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Duration (minutes)</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Charge</th>
              <th>Paid</th>
            </tr>
          </thead>

          <tbody>
            {this.props.lessons.map(lesson => (
              <tr key={lesson.id}>
                <td>{lesson.day}</td>
                <td>{new Date(lesson.time).toUTCString()}</td>
                <td>{lesson.duration}</td>
                <td>{lesson.plan}</td>
                <td>{lesson.status}</td>
                <td>{lesson.charge}</td>
                <td>{lesson.paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    lessons: Object.values(state.lessons),
    student: state.students[ownProps.match.params.id]
  };
};
export default connect(mapStateToProps, { getLessonList, getStudent })(
  LessonList
);
