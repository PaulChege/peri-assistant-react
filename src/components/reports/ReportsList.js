import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getReportsList } from "../../actions/reports";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import "../../styling/styles.css";

function ReportsList(props) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    props.getReportsList(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  // Helper to format date as 'Mon, 1st Jan 2025'
  function formatPrettyDate(date) {
    if (!date) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(date);
    const dayOfWeek = days[d.getDay()];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    // Ordinal suffix
    const j = day % 10, k = day % 100;
    let suffix = 'th';
    if (j === 1 && k !== 11) suffix = 'st';
    else if (j === 2 && k !== 12) suffix = 'nd';
    else if (j === 3 && k !== 13) suffix = 'rd';
    return `${dayOfWeek}, ${day}${suffix} ${month} ${year}`;
  }

  // Helper to render reports table
  const renderReportsTable = (reports) => {
    return (
      <table className="table table-bordered table-responsive-sm table-sm table-auto" style={{ tableLayout: 'auto' }}>
        <thead className="thead-light">
          <tr>
            <th style={{ whiteSpace: 'nowrap' }}>Student</th>
            <th style={{ whiteSpace: 'nowrap' }}>Start Date</th>
            <th style={{ whiteSpace: 'nowrap' }}>End Date</th>
            <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            if (!report) return null;
            return (
              <tr key={report.id}>
                <td>
                  <span style={{ fontWeight: 'bold' }}>
                    {report.student?.name || 'Unknown Student'}
                  </span>
                </td>
                <td>{formatPrettyDate(report.start_date)}</td>
                <td>{formatPrettyDate(report.end_date)}</td>
                <td>
                  <Link
                    to={`/reports/${report.id}/edit`}
                    className="btn btn-primary btn-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Pagination controls
  const renderPagination = (currentPage, totalPages, onPageChange) => (
    <nav>
      <ul className="pagination pagination-sm">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page} className={`page-item${page === currentPage ? " active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>{page}</button>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Get reports and pagination info from props
  const reports = props.reports || { reports: [], current_page: 1, total_pages: 1 };

  return (
    <div className="container main-content">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <FontAwesomeIcon icon={faFileAlt} className="me-2" />
          Reports
        </h4>
        <Link to="/reports/create" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create Report
        </Link>
      </div>
      
      <p className="text-danger">{props.errors}</p>
      <br />
      
      {reports.reports && reports.reports.length > 0 ? (
        <>
          {renderReportsTable(reports.reports)}
          {renderPagination(reports.current_page || 1, reports.total_pages || 1, setCurrentPage)}
        </>
      ) : (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faFileAlt} size="3x" className="text-muted mb-3" />
          <h5 className="text-muted">No reports found</h5>
          <p className="text-muted">Create your first report to get started.</p>
          <Link to="/reports/create" className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Create Report
          </Link>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errors: state.errors.reportError,
    reports: state.reports.reports,
  };
};

export default connect(mapStateToProps, { getReportsList })(ReportsList);
