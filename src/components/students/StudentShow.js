import React from "react";
import { Link } from "react-router-dom";
import {
  calculate_age,
  getReadableDate,
  getDayofWeek,
  getTime
} from "../../helper";
import StudentDeleteModal from "./StudentDeleteModal";

const onClose = e => {
  this.props.onClose && this.props.onClose(e);
};

const StudentShow = ({ student }) => {
  if (student) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <h5 className="col-sm-12">Student Details</h5>

            <ul style={{ listStyleType: "none" }} className="col-sm-4">
              <li>
                <b>Name: </b>
                {student.name}
              </li>
              <li>
                <b>Mobile Number: </b>
                {student.mobile_number}
              </li>
              <li>
                <b>Email: </b>
                {student.email}
              </li>
              <li>
                <b>Age: </b>
                {calculate_age(new Date(student.date_of_birth))} years
              </li>
            </ul>
            <ul style={{ listStyleType: "none" }} className="col-sm-4">
              <li>
                <b>Institution: </b>
                {student.institution}
              </li>
              <li>
                <b>Instrument: </b>
                {student.instrument}
              </li>
              <li>
                <b>Goals: </b>
                {student.goals}
              </li>
              <li>
                <b>Started on: </b>
                {getReadableDate(student.start_date)}
              </li>
            </ul>
            <ul style={{ listStyleType: "none" }} className="col-sm-4">
              <li>
                <b>Usual Lesson Time: </b>
                {getDayofWeek(student.lesson_day)}s at{" "}
                {getTime(student.lesson_time)}
              </li>
              <li>
                <b>Usual Lesson Duration: </b>
                {`${
                  student.lesson_duration !== null
                    ? student.lesson_duration + " minutes"
                    : ""
                }`}
              </li>
              <li>
                <b>Usual Lesson Charge: </b>
                {` ${
                  student.lesson_charge !== null
                    ? "Ksh " + student.lesson_charge
                    : ""
                }`}
              </li>
            </ul>
          </div>
          <div className="float-right">
            <Link
              to={`/student/${student.id}/edit`}
              className="btn btn-primary btn-sm"
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-danger btn-sm mx-sm-2"
              data-toggle="modal"
              data-target="#studentDeleteModal"
            >
              Delete
            </button>
          </div>
        </div>
        <StudentDeleteModal onClose={onClose} student={student} />
      </div>
    );
  }
  return <div>Loading...</div>;
};

export default StudentShow;
