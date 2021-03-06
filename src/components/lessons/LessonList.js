import React from "react";
import { connect } from "react-redux";
import { getLessonList, sendPaymentReminders } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { Link } from "react-router-dom";
import StudentShow from "../students/StudentShow";
import { getTime, getReadableDate } from "../../helper";
import LessonDeleteModal from "./LessonDeleteModal";
import "../../styling/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

class LessonList extends React.Component {
  componentDidMount() {
    this.props.getStudent(this.props.match.params.id);
    this.props.getLessonList(this.props.match.params.id);
  }

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
  };

  sendPaymentReminders = () => {
    this.props.sendPaymentReminders(this.props.match.params.id);
  };
  render() {
    return (
      <div className="container">
        <p className="text-danger">{this.props.errors}</p>
        <StudentShow student={this.props.student} />
        <br />
        <Link
          to={`/student/${this.props.match.params.id}/lessons/create`}
          className="btn btn-outline-primary btn-sm"
          style={this.buttonStyle}
        >
          <FontAwesomeIcon icon={faPlus} className="icon-padded" />
          Add Lesson
        </Link>
        <button
          className="btn btn-sm btn-success float-right"
          onClick={this.sendPaymentReminders}
        >
          <FontAwesomeIcon icon={faMoneyBill} className="icon-padded" />
          Send Payment Reminder
        </button>
        <br />
        <br />
        <h5>Lessons{` (${this.props.lessons.length})`}</h5>
        <table className="table table-bordered table-responsive-sm table-sm">
          <thead className="thead-light">
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Duration(min)</th>
              <th>Status</th>
              <th>Charge</th>
              <th>Paid</th>
              <th>Plan</th>
            </tr>
          </thead>

          <tbody>
            {this.props.lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td>{getReadableDate(lesson.day)}</td>
                <td>{getTime(lesson.time)}</td>
                <td>{lesson.duration}</td>
                <td>{lesson.status}</td>
                <td>{lesson.charge}</td>
                <td>{lesson.paid ? "Yes" : "No"}</td>
                <td>{lesson.plan}</td>
                <td>
                  <Link
                    to={`/student/${this.props.match.params.id}/lesson/${lesson.id}/edit`}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm mx-sm-3"
                    data-toggle="modal"
                    data-target={`#lessonDeleteModal${lesson.id}`}
                  >
                    Delete
                  </button>
                  <LessonDeleteModal
                    onClose={this.onClose}
                    student={this.props.student}
                    lesson={lesson}
                    id={`lessonDeleteModal${lesson.id}`}
                  />
                </td>
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
    errors: state.errors.paymentReminderError,
    lessons: Object.values(state.lessons),
    student: state.students[ownProps.match.params.id],
  };
};
export default connect(mapStateToProps, {
  getLessonList,
  getStudent,
  sendPaymentReminders,
})(LessonList);
