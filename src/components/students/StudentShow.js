import React from "react";
import { Link } from "react-router-dom";
import { calculate_age, getReadableDate, getDayofWeek } from "../../helper";

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
            </ul>
            <ul style={{ listStyleType: "none" }} className="col-sm-4">
              {/* TODO - Change to show the readable times */}
              <li>
                <b>Started on: </b>
                {getReadableDate(student.start_date)}
              </li>
              <li>
                <b>Usual Lesson Time: </b>
                {getDayofWeek(student.lesson_day)}s at {student.lesson_time}
              </li>
            </ul>
          </div>
          <div className="float-right">
            <Link
              to={`/student/${student.id}/edit`}
              className="btn btn-primary"
            >
              Edit
            </Link>
            <Link to="/" className="btn btn-danger">
              Delete
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
};

export default StudentShow;
