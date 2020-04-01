import React from "react";
import { connect } from "react-redux";
import { updateStudent, getStudent } from "../../actions/students";
import { getInstrumentList } from "../../actions/instruments";
import StudentForm from "./StudentForm";
import { getTime } from "../../helper";
import { trackPromise } from "react-promise-tracker";

class StudentEdit extends React.Component {
  componentDidMount() {
    this.props.getInstrumentList();
    this.props.getStudent(this.props.match.params.id);
  }
  onSubmit = formValues => {
    trackPromise(
      this.props.updateStudent(this.props.match.params.id, formValues)
    );
  };
  renderInitialValues = () => {
    if (this.props.initialValues) {
      return {
        ...this.props.initialValues,
        lesson_time: getTime(this.props.initialValues.lesson_time)
      };
    }
  };
  render() {
    return (
      <StudentForm
        title="Edit Student"
        initialValues={this.renderInitialValues()}
        onSubmit={this.onSubmit}
        errors={this.props.errors}
        instrumentList={this.props.instrumentList}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.errors.studentUpdateError,
    instrumentList: state.instruments.instrumentList,
    initialValues: state.students[ownProps.match.params.id]
  };
};
export default connect(mapStateToProps, {
  updateStudent,
  getStudent,
  getInstrumentList
})(StudentEdit);
