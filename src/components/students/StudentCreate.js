import React, { useCallback, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { createStudent, clearStudentCreateSuccess } from "../../actions/students";
import { getInstrumentList } from "../../actions/instruments";
import { getUser } from "../../actions/users";
import StudentForm from "../../components/students/StudentForm";
import { trackPromise } from "react-promise-tracker";
import { useNavigate } from "react-router-dom";

function StudentCreate({ createStudent, getInstrumentList, clearStudentCreateSuccess, errors, instrumentList, getUser, currentUser }) {
  const navigate = useNavigate();
  const studentCreated = useSelector(state => state.students.studentCreated);

  useEffect(() => {
    getInstrumentList();
    if (!currentUser) getUser();
    clearStudentCreateSuccess(); // Clear flag on mount
    return () => clearStudentCreateSuccess(); // Clear flag on unmount
  }, [getInstrumentList, clearStudentCreateSuccess, getUser, currentUser]);

  useEffect(() => {
    if (studentCreated) {
      navigate("/");
    }
  }, [studentCreated, navigate]);

  const onSubmit = useCallback(async (formValues) => {
    await trackPromise(createStudent(formValues));
    // Do not navigate here!
  }, [createStudent]);

  return (
    <div className="container main-content">
      <div className="lesson-form-card">
        <StudentForm
          title="Add Student"
          onSubmit={onSubmit}
          errors={errors}
          instrumentList={instrumentList}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    errors: state.errors.studentCreateError,
    instrumentList: state.instruments.instrumentList,
    currentUser: state.user.currentUser,
  };
};
export default connect(mapStateToProps, {
  createStudent,
  getInstrumentList,
  clearStudentCreateSuccess,
  getUser
})(StudentCreate);
