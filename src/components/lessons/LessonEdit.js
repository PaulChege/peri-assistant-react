import React from "react";
import LessonForm from "./LessonForm";
import { connect } from "react-redux";
import { updateLesson, getLesson } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { getTime } from "../../helper";

class LessonEdit extends React.Component {
  componentDidMount() {
    const { studentId, id } = this.props.match.params;
    this.props.getStudent(studentId);
    this.props.getLesson(studentId, id);
  }
  onSubmit = formValues => {
    const { studentId, id } = this.props.match.params;
    this.props.updateLesson(studentId, id, formValues);
  };

  renderTitle = () => {
    if (this.props.student) {
      return `Edit Lesson for ${this.props.student.name}`;
    } else {
      return "Edit Lesson";
    }
  };

  renderInitialValues = () => {
    if (this.props.initialValues) {
      return {
        ...this.props.initialValues,
        time: getTime(this.props.initialValues.time)
      };
    }
  };
  render() {
    return (
      <LessonForm
        title={this.renderTitle()}
        onSubmit={this.onSubmit}
        errors={this.props.errors}
        initialValues={this.renderInitialValues()}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: state.lessons[ownProps.match.params.id],
    student: state.students[ownProps.match.params.studentId],
    errors: state.errors.lessonUpdateError
  };
};

export default connect(mapStateToProps, {
  updateLesson,
  getStudent,
  getLesson
})(LessonEdit);
