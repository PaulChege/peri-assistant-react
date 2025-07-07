import React from "react";
import { Form, Field } from "react-final-form";
import LoadingIndicator from "../LoadingIndicator";

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
        <Form
          onSubmit={this.props.onSubmit}
          initialValues={this.props.initialValues}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <label>Day</label>
                  <Field
                    name="day"
                    render={({ input }) => this.renderForm(input, "", "date")}
                  />
                  <label>Time</label>
                  <Field
                    name="time"
                    render={({ input }) => this.renderForm(input, "", "time")}
                  />
                  <label>Duration (Minutes)</label>
                  <Field
                    name="duration"
                    render={({ input }) => this.renderForm(input, "", "number")}
                  />
                  <label>Plan</label>
                  <Field
                    name="plan"
                    render={({ input }) => {
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
                    render={({ input }) => {
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
                    render={({ input }) => this.renderForm(input, "", "number")}
                  />
                  <label>Paid</label>
                  <Field
                    name="paid"
                    render={({ input }) => {
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
              <LoadingIndicator />
              <button className="btn btn-primary">Save</button>
            </form>
          )}
        />
      </div>
    );
  }
}
export default LessonForm;
