import React from "react";
import { connect } from "react-redux";
import { createStudent } from "../../actions/students";
import { getInstrumentList } from "../../actions/instruments";
import StudentForm from "../../components/students/StudentForm";

class StudentCreate extends React.Component {
  componentDidMount() {
    this.props.getInstrumentList();
  }
  onSubmit = formValues => {
    this.props.createStudent(formValues);
  };
  render() {
    return (
      <StudentForm
        title="Add Student"
        onSubmit={this.onSubmit}
        errors={this.props.errors}
        instrumentList={this.props.instrumentList}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.errors.studentCreateError,
    instrumentList: state.instruments.instrumentList
  };
};
export default connect(mapStateToProps, {
  createStudent,
  getInstrumentList
})(StudentCreate);
