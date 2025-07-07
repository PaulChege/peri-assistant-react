import React, { useCallback, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { updateStudent, getStudent, clearStudentUpdateSuccess } from "../../actions/students";
import { getInstrumentList } from "../../actions/instruments";
import StudentForm from "./StudentForm";
import { getTime } from "../../helper";
import { trackPromise } from "react-promise-tracker";
import { useNavigate, useParams } from "react-router-dom";

function StudentEdit({ updateStudent, getStudent, getInstrumentList, clearStudentUpdateSuccess, errors, instrumentList, initialValues }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const studentUpdated = useSelector(state => state.students.studentUpdated);

  useEffect(() => {
    getInstrumentList();
    getStudent(id);
    clearStudentUpdateSuccess(); // Clear flag on mount
    return () => clearStudentUpdateSuccess(); // Clear flag on unmount
  }, [getInstrumentList, getStudent, id, clearStudentUpdateSuccess]);

  useEffect(() => {
    if (studentUpdated) {
      navigate(`/student/${id}/lessons`);
    }
  }, [studentUpdated, navigate, id]);

  const onSubmit = useCallback(async (formValues) => {
    await trackPromise(updateStudent(id, formValues));
    // Do not navigate here!
  }, [updateStudent, id]);

  const renderInitialValues = () => {
    if (initialValues) {
      return {
        ...initialValues,
        lesson_time: getTime(initialValues.lesson_time)
      };
    }
  };

  return (
    <StudentForm
      title="Edit Student"
      initialValues={renderInitialValues()}
      onSubmit={onSubmit}
      errors={errors}
      instrumentList={instrumentList}
    />
  );
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match ? ownProps.match.params : {};
  return {
    errors: state.errors.studentUpdateError,
    instrumentList: state.instruments.instrumentList,
    initialValues: state.students[id]
  };
};
export default connect(mapStateToProps, {
  updateStudent,
  getStudent,
  getInstrumentList,
  clearStudentUpdateSuccess
})(StudentEdit);
