import React from "react";
import { connect } from "react-redux";
import { updateStudent, getStudent } from "../../actions/students";
import { getInstrumentList } from "../../actions/instruments";
import StudentForm from "./StudentForm";

class StudentEdit extends React.Component {
  componentDidMount() {
    this.props.getInstrumentList();
    this.props.getStudent(this.props.match.params.id);
  }
  onSubmit = formValues => {
    this.props.updateStudent(this.props.match.params.id, formValues);
  };
  render() {
    return (
      <StudentForm
        title="Edit Student"
        initialValues={this.props.initialValues}
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
