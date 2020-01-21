import React from "react";
import { reduxForm, Field } from "redux-form";

class LessonForm extends React.Component {
  renderForm(input, placeholder, type = "") {
    return (
      <div className="form-group">
        <input
          {...input}
          placeholder={placeholder}
          type={type}
          className="form-control"
        />
      </div>
    );
  }
  render() {
    return (
      <div className="container">
        <br />
        <br />
        <h5>{this.props.title}</h5>
        <p className="text-danger">{this.props.errors}</p>
        <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
          <div className="row">
            <div className="col-sm-6">
              <label>Day</label>
              <Field
                name="day"
                component={({ input }) => this.renderForm(input, "", "date")}
              />
              <label>Time</label>
              <Field
                name="time"
                component={({ input }) => this.renderForm(input, "", "time")}
              />
              <label>Duration (Minutes)</label>
              <Field
                name="duration"
                component={({ input }) => this.renderForm(input, "", "number")}
              />
              <label>Plan</label>
              <Field
                name="plan"
                component={({ input }) => {
                  return (
                    <div className="form-group">
                      <textarea
                        {...input}
                        placeholder="Your lesson plan is..."
                        className="form-control"
                      />
                    </div>
                  );
                }}
              />
            </div>
            <div className="col-sm-6">
              <label>Status</label>
              <Field
                name="status"
                component={({ input }) => {
                  return (
                    <div className="form-group">
                      <select {...input} className="form-control">
                        <option></option>
                        <option value="attended">Attended</option>
                        <option value="missed">Missed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  );
                }}
              />
              <label>Charge</label>
              <Field
                name="charge"
                component={({ input }) => this.renderForm(input, "", "number")}
              />
              <label>Paid</label>
              <Field
                name="paid"
                component={({ input }) => {
                  return (
                    <div className="form-group">
                      <input
                        {...input}
                        type="checkbox"
                        className="form-control"
                        checked={input.value}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <br />
          <button className="btn btn-primary">Save</button>
        </form>
      </div>
    );
  }
}
export default reduxForm({ form: "lessonForm" })(LessonForm);
