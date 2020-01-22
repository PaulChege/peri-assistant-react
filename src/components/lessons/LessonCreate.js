import React from "react";
import LessonForm from "./LessonForm";
import { connect } from "react-redux";
import { createLesson } from "../../actions/lessons";
import { getStudent } from "../../actions/students";
import { getTime, getDateFromDay } from "../../helper";

class LessonCreate extends React.Component {
  componentDidMount() {
    this.props.getStudent(this.props.match.params.id);
  }

  onSubmit = formValues => {
    this.props.createLesson(this.props.match.params.id, formValues);
  };

  renderInitialValues = () => {
    const { student } = this.props;
    if (student) {
      return {
        day: getDateFromDay(student.lesson_day),
        paid: false,
        duration: student.lesson_duration,
        charge: student.lesson_charge,
        time: getTime(student.lesson_time)
      };
    }
  };

  renderTitle = () => {
    if (this.props.student) {
      return `Add Lesson for ${this.props.student.name}`;
    } else {
      return "Add Lesson";
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
    student: state.students[ownProps.match.params.id],
    errors: state.errors.lessonCreateError
  };
};

export default connect(mapStateToProps, { createLesson, getStudent })(
  LessonCreate
);
