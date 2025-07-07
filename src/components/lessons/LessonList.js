import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getLessonList, sendPaymentReminders } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { Link, useParams } from "react-router-dom";
import StudentShow from "../students/StudentShow";
import { getTime, getReadableDate } from "../../helper";
import LessonDeleteModal from "./LessonDeleteModal";
import "../../styling/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

function LessonList(props) {
  const { id } = useParams();
  const buttonStyle = { color: "white" };

  useEffect(() => {
    props.getStudent(id);
    props.getLessonList(id);
    // eslint-disable-next-line
  }, [id]);

  const sendPaymentReminders = () => {
    props.sendPaymentReminders(id);
  };

  return (
    <div className="container">
      <p className="text-danger">{props.errors}</p>
      <StudentShow student={props.student} />
      <br />
      <Link
        to={`/student/${id}/lessons/create`}
        className="btn btn-outline-primary btn-sm"
      >
        <FontAwesomeIcon icon={faPlus} className="icon-padded" />
        Add Lesson
      </Link>
      <button
        className="btn btn-sm btn-success float-right"
        onClick={sendPaymentReminders}
      >
        <FontAwesomeIcon icon={faMoneyBill} className="icon-padded" />
        Send Payment Reminder
      </button>
      <br />
      <br />
      <h5>Lessons{` (${props.lessons.length})`}</h5>
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
          {props.lessons.map((lesson) => (
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
                  to={`/student/${id}/lesson/${lesson.id}/edit`}
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
                  onClose={props.onClose}
                  student={props.student}
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

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id;
  return {
    errors: state.errors.paymentReminderError,
    lessons: (state.lessons.lessons || []).filter(lesson => lesson && lesson.id !== undefined),
    student: state.students[id],
  };
};
export default connect(mapStateToProps, {
  getLessonList,
  getStudent,
  sendPaymentReminders,
})(props => {
  const params = useParams();
  return <LessonList {...props} id={params.id} />;
});
