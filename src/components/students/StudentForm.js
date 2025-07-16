import React, { useState, useRef } from "react";
import { Field, Form } from "react-final-form";
import LoadingIndicator from "../LoadingIndicator";
import periAssistantApi from "../../api/periAssistantApi";
import 'react-clock/dist/Clock.css';

function InstitutionAutocomplete({ input, disabled, ...rest }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef();

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await periAssistantApi.get(`/institutions/search?q=${encodeURIComponent(query)}`);
      setSuggestions(Array.isArray(response.data) ? response.data : (response.data.results || []));
    } catch (e) {
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    input.onChange(value);
    setShowDropdown(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    input.onChange(suggestion);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="form-group" style={{ position: "relative" }}>
      <input
        {...input}
        {...rest}
        value={input.value}
        onChange={handleChange}
        placeholder="Institution"
        className="form-control"
        autoComplete="off"
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => input.value && setShowDropdown(true)}
        disabled={disabled}
      />
      {loading && <div>Loading...</div>}
      {showDropdown && suggestions.length > 0 && !disabled && (
        <ul className="list-group" style={{ position: "absolute", zIndex: 1000, width: "100%" }}>
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(suggestion)}
              style={{ cursor: "pointer" }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InstrumentDropdown({ input, instrumentList }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    let newValue = Array.isArray(input.value) ? [...input.value] : [];
    if (e.target.checked) {
      if (!newValue.includes(value)) newValue.push(value);
    } else {
      newValue = newValue.filter(v => v !== value);
    }
    input.onChange(newValue);
  };

  const selected = Array.isArray(input.value) ? input.value : [];
  const label = selected.length > 0 ? selected.join(", ") : "Select instrument(s)";

  return (
    <div className="form-group" ref={dropdownRef} style={{ position: "relative" }}>
      <div
        className="form-control"
        style={{ cursor: "pointer", minHeight: 38, userSelect: "none" }}
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
      >
        {label}
        <span style={{ float: "right" }}>&#9662;</span>
      </div>
      {open && (
        <div
          className="dropdown-menu show"
          style={{ display: "block", position: "absolute", width: "100%", zIndex: 1000, maxHeight: 200, overflowY: "auto" }}
        >
          {instrumentList.map((instrument, index) => (
            <label className="dropdown-item" key={index} style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                value={instrument}
                checked={selected.includes(instrument)}
                onChange={handleCheckboxChange}
                style={{ marginRight: 8 }}
                onClick={e => e.stopPropagation()}
              />
              {instrument}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

class StudentForm extends React.Component {
  // Remove constructor and state

  // Remove componentDidMount and componentDidUpdate

  handleHomeLessonsChange = (e, input) => {
    const checked = e.target.checked;
    if (checked) {
      input.onChange(true);
    } else {
      input.onChange(false);
    }
  };

  renderForm(input, placeholder, type = "") {
    return (
      <div className="form-group mb-3">
        <input
          {...input}
          placeholder={placeholder}
          type={type}
          className="form-control"
        />
      </div>
    );
  }

  daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  renderScheduleFields = (values) => {
    const schedule = typeof values.schedule === 'object' && !Array.isArray(values.schedule) ? values.schedule : {};
    return (
      <div>
        <hr className="mt-2 mb-4" />
        <h6 className="mb-3">Schedule</h6>
        <div className="row font-weight-bold mb-2">
          <div className="col-1"></div>
          <div className="col-2">Day</div>
          <div className="col-4">Start Time</div>
          <div className="col-4">Duration (min)</div>
        </div>
        {this.daysOfWeek.map((day) => {
          const key = day.value;
          const enabled = schedule[key] && schedule[key].enabled;
          return (
            <div className="row align-items-center mb-2" key={day.value}>
              <div className="col-1 pr-0" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Field
                  name={`schedule.${key}.enabled`}
                  type="checkbox"
                  render={({ input }) => (
                    <input type="checkbox" {...input} style={{ marginRight: 0 }} />
                  )}
                />
              </div>
              <div className="col-2 pl-3">{day.label}</div>
              <div className="col-4">
                <Field
                  name={`schedule.${key}.start_time`}
                  render={({ input }) => (
                    <input
                      {...input}
                      type="time"
                      className="form-control"
                      disabled={!enabled}
                    />
                  )}
                />
              </div>
              <div className="col-4">
                <Field
                  name={`schedule.${key}.duration`}
                  render={({ input }) => (
                    <input
                      {...input}
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="min"
                      disabled={!enabled}
                    />
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  handleSubmit = (values) => {
    // Transform schedule to array of enabled days
    let scheduleArr = [];
    if (values.schedule) {
      scheduleArr = Object.entries(values.schedule)
        .filter(([_, v]) => v && v.enabled)
        .map(([dayKey, v]) => {
          // Convert local time (hh:mm) to UTC (hh:mm)
          let start_time = v.start_time;
          if (start_time && start_time.length === 5) {
            // Assume start_time is in local time, convert to UTC
            const [h, m] = start_time.split(":").map(Number);
            const localDate = new Date();
            localDate.setHours(h, m, 0, 0);
            const utcHours = localDate.getUTCHours().toString().padStart(2, '0');
            const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, '0');
            start_time = `${utcHours}:${utcMinutes}`;
          }
          // Convert react-time-picker value (hh:mm am/pm or 24h) to 24-hour format for API
          if (start_time && /[aApP][mM]$/.test(start_time)) {
            let [time, ampm] = start_time.split(/ ?([aApP][mM])/);
            let [h, m] = time.split(":");
            h = parseInt(h, 10);
            if (ampm.toLowerCase() === "pm" && h !== 12) h += 12;
            if (ampm.toLowerCase() === "am" && h === 12) h = 0;
            start_time = `${h.toString().padStart(2, "0")}:${m}`;
          } else if (start_time && start_time.length === 5) {
            // Already handled above
          } else if (start_time) {
            let [h, m] = start_time.split(":");
            h = parseInt(h, 10);
            if (h < 10 && start_time[0] !== '0') h = '0' + h;
            start_time = `${h}:${m}`;
          }
          // Map dayKey to label
          const dayLabel = this.daysOfWeek.find(d => d.value === dayKey)?.label || dayKey;
          return {
            day: dayLabel,
            start_time,
            duration: v.duration
          };
        });
    }
    const submitValues = {
      ...values,
      homeLessons: undefined,
      institution: (values.homeLessons) ? 'Home' : values.institution,
      instruments: Array.isArray(values.instruments) ? values.instruments.join(',') : values.instruments,
      schedule: scheduleArr,
      lesson_unit_charge: values.lesson_unit_charge,
    };
    delete submitValues.homeLessons;
    this.props.onSubmit(submitValues);
  };

  render() {
    return (
      <div className="container">
        <br />
        <br />
        <h5>{this.props.title}</h5>
        <p className="text-danger">{this.props.errors}</p>
        <Form
          onSubmit={this.handleSubmit}
          initialValues={this.props.initialValues}
          key={JSON.stringify(this.props.initialValues)}
          enableReinitialize={true}
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <Field
                    name="name"
                    render={({ input }) => this.renderForm(input, "Name")}
                  />
                  <Field
                    name="email"
                    render={({ input }) =>
                      this.renderForm(input, "Email", "email")
                    }
                  />
                  <Field
                    name="mobile_number"
                    render={({ input }) =>
                      this.renderForm(input, "Mobile Number")
                    }
                  />
                  {/* Home Lessons Checkbox */}
                  <Field
                    name="homeLessons"
                    type="checkbox"
                    render={({ input }) => (
                      <div className="form-group form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="homeLessonsCheckbox"
                          checked={!!input.value}
                          onChange={e => this.handleHomeLessonsChange(e, input)}
                        />
                        <label className="form-check-label" htmlFor="homeLessonsCheckbox">
                          Home Lessons
                        </label>
                      </div>
                    )}
                  />
                  {/* Institution Autocomplete Field (backend) */}
                  <Field
                    name="institution"
                    render={({ input }) => (
                      <div className="mb-4">
                        <InstitutionAutocomplete input={input} disabled={values.homeLessons} />
                      </div>
                    )}
                  />
                  <Field
                    name="instruments"
                    render={({ input }) => (
                      <div className="mb-4">
                        <InstrumentDropdown input={input} instrumentList={this.props.instrumentList} />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-6">
                  {this.renderScheduleFields(values)}
                </div>
                <div className="col-sm-6"></div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <hr className="mt-4 mb-3" />
                </div>
                <div className="col-sm-6"></div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-sm-6">
                  <div className="form-group mb-0 d-flex align-items-center">
                    <label
                      htmlFor="lesson_unit_charge"
                      className="me-3 mb-0"
                      style={{ minWidth: 130 }}
                    >
                      Charge per 30min:
                    </label>
                    <span className="me-3" style={{ minWidth: 40, display: 'inline-block', textAlign: 'center' }}>{(this.props.currentUser && this.props.currentUser.currency)}</span>
                    <Field
                      name="lesson_unit_charge"
                      render={({ input }) => (
                        <input
                          {...input}
                          id="lesson_unit_charge"
                          type="number"
                          min="0"
                          className="form-control d-inline-block"
                          style={{ width: 140 }}
                          placeholder="Charge"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <br />
              <LoadingIndicator />
              <div className="row">
                <div className="col-sm-6">
                  <div className="d-flex justify-content-center mt-4">
                    <button className="btn btn-primary" style={{ minWidth: 140 }}>Save</button>
                  </div>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

export default StudentForm;
