import React, { useCallback, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { createReport, clearReportCreateSuccess } from "../../actions/reports";
import ReportForm from "./ReportForm";
import { trackPromise } from "react-promise-tracker";
import { useNavigate } from "react-router-dom";

function ReportCreate({ createReport, clearReportCreateSuccess, errors }) {
  const navigate = useNavigate();
  const reportCreated = useSelector(state => state.reports.reportCreated);

  useEffect(() => {
    clearReportCreateSuccess(); // Clear flag on mount
    return () => clearReportCreateSuccess(); // Clear flag on unmount
  }, [clearReportCreateSuccess]);

  useEffect(() => {
    if (reportCreated) {
      navigate("/reports");
    }
  }, [reportCreated, navigate]);

  const onSubmit = useCallback(async (formValues) => {
    await trackPromise(createReport(formValues));
    // Do not navigate here!
  }, [createReport]);

  return (
    <div className="container main-content">
      <div className="lesson-form-card">
        <ReportForm
          title="Create Report"
          onSubmit={onSubmit}
          errors={errors}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errors: state.errors.reportCreateError,
  };
};

export default connect(mapStateToProps, { createReport, clearReportCreateSuccess })(ReportCreate);
