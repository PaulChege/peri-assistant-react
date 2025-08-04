import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import periAssistantApi from "../../api/periAssistantApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styling/styles.css";

function BreaksList(props) {
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBreak, setEditingBreak] = useState(null);
  const [deletingBreaks, setDeletingBreaks] = useState(new Set());

  useEffect(() => {
    fetchBreaks();
  }, []);

  const fetchBreaks = async () => {
    try {
      setLoading(true);
      const response = await periAssistantApi.get('/breaks');
      setBreaks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch breaks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBreak = async (breakId) => {
    try {
      setDeletingBreaks(prev => new Set(prev).add(breakId));
      await periAssistantApi.delete(`/breaks/${breakId}`);
      
      // Remove the break from the list after successful deletion
      setBreaks(prev => prev.filter(breakItem => breakItem.id !== breakId));
    } catch (error) {
      console.error('Failed to delete break:', error);
    } finally {
      setDeletingBreaks(prev => {
        const newSet = new Set(prev);
        newSet.delete(breakId);
        return newSet;
      });
    }
  };

  const handleEditBreak = (breakItem) => {
    setEditingBreak({
      id: breakItem.id,
      start_date: breakItem.start_date,
      end_date: breakItem.end_date
    });
  };

  const handleSaveBreak = async () => {
    try {
      await periAssistantApi.put(`/breaks/${editingBreak.id}`, {
        start_date: editingBreak.start_date,
        end_date: editingBreak.end_date
      });
      
      // Update the break in the list
      setBreaks(prev => prev.map(breakItem => 
        breakItem.id === editingBreak.id 
          ? { ...breakItem, start_date: editingBreak.start_date, end_date: editingBreak.end_date }
          : breakItem
      ));
      
      setEditingBreak(null);
    } catch (error) {
      console.error('Failed to update break:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingBreak(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container main-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <div className="spinner-border" role="status"></div>
            <div className="mt-2">Loading breaks...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container main-content">
      <h4>Breaks</h4>
      <p className="text-muted">Lessons won't be scheduled during breaks</p>
      
      {breaks.length === 0 ? (
        <div className="text-center text-muted" style={{ fontSize: '1.2em', padding: '2em 0' }}>
          No breaks scheduled
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Break By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {breaks.map((breakItem) => (
                <tr key={breakItem.id}>
                  <td>
                    {editingBreak && editingBreak.id === breakItem.id ? (
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={editingBreak.start_date}
                        onChange={(e) => setEditingBreak(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    ) : (
                      formatDate(breakItem.start_date)
                    )}
                  </td>
                  <td>
                    {editingBreak && editingBreak.id === breakItem.id ? (
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={editingBreak.end_date}
                        onChange={(e) => setEditingBreak(prev => ({ ...prev, end_date: e.target.value }))}
                      />
                    ) : (
                      formatDate(breakItem.end_date)
                    )}
                  </td>
                  <td>{breakItem.break_by}</td>
                  <td>
                    {editingBreak && editingBreak.id === breakItem.id ? (
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-success"
                          onClick={handleSaveBreak}
                          title="Save changes"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleCancelEdit}
                          title="Cancel editing"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditBreak(breakItem)}
                          title="Edit break"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteBreak(breakItem.id)}
                          disabled={deletingBreaks.has(breakItem.id)}
                          title="Delete break"
                        >
                          {deletingBreaks.has(breakItem.id) ? (
                            <div className="spinner-border spinner-border-sm" role="status"></div>
                          ) : (
                            <FontAwesomeIcon icon={faTrash} />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(BreaksList); 