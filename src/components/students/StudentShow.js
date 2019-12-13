import React from "react";

const StudentShow = ({ student }) => {
  if (student) {
    return (
      <div className="">
        <br />
        <br />
        <h5>Student Details</h5>
        <p>{student.name}</p>
      </div>
    );
  }
  return <div>Loading...</div>;
};

export default StudentShow;
