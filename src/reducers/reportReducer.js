import {
  REPORTS_LIST,
  REPORTS_CREATE,
  REPORTS_CREATE_SUCCESS,
  REPORTS_CREATE_CLEAR,
  REPORTS_UPDATE,
  REPORTS_UPDATE_SUCCESS,
  REPORTS_UPDATE_CLEAR,
  REPORTS_UPDATE_FAILED,
  REPORTS_SHOW,
  REPORTS_DELETE
} from "../actions/types";

const INITIAL_STATE = { 
  reportCreated: false, 
  reportUpdated: false, 
  reports: { reports: [], current_page: 1, total_pages: 1 }, 
  currentReport: null 
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REPORTS_LIST:
      return { ...state, reports: action.payload };
    case REPORTS_SHOW:
      return { ...state, currentReport: action.payload };
    case REPORTS_CREATE:
      return {
        ...state,
        reports: {
          ...state.reports,
          reports: [...(state.reports.reports || []), action.payload]
        }
      };
    case REPORTS_CREATE_SUCCESS:
      return { ...state, reportCreated: true };
    case REPORTS_CREATE_CLEAR:
      return { ...state, reportCreated: false };
    case REPORTS_UPDATE:
      return {
        ...state,
        reports: {
          ...state.reports,
          reports: (state.reports.reports || []).map(r => r.id === action.payload.id ? action.payload : r)
        }
      };
    case REPORTS_UPDATE_SUCCESS:
      return { ...state, reportUpdated: true };
    case REPORTS_UPDATE_CLEAR:
      return { ...state, reportUpdated: false };
    case REPORTS_DELETE:
      return {
        ...state,
        reports: {
          ...state.reports,
          reports: (state.reports.reports || []).filter(r => r.id !== action.payload)
        }
      };
    default:
      return state;
  }
};
