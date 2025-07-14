import {
  STUDENT_LESSONS_LIST,
  STUDENT_LESSONS_CREATE,
  STUDENT_LESSONS_CREATE_SUCCESS,
  STUDENT_LESSONS_CREATE_CLEAR,
  STUDENT_LESSONS_UPDATE,
  STUDENT_LESSONS_UPDATE_SUCCESS,
  STUDENT_LESSONS_UPDATE_CLEAR,
  STUDENT_LESSONS_UPDATE_FAILED,
  STUDENT_LESSONS_SHOW,
  STUDENT_LESSONS_DELETE
} from "../actions/types";

const INITIAL_STATE = { lessonCreated: false, lessonUpdated: false, past_lessons: {}, upcoming_lessons: {}, metadata: {}, currentLesson: null };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STUDENT_LESSONS_LIST:
      return { ...state, ...action.payload };
    case STUDENT_LESSONS_SHOW:
      // Store the fetched lesson for editing
      return { ...state, currentLesson: action.payload };
    case STUDENT_LESSONS_CREATE:
      // Add to upcoming_lessons if present
      return {
        ...state,
        upcoming_lessons: {
          ...state.upcoming_lessons,
          lessons: [...(state.upcoming_lessons.lessons || []), action.payload]
        }
      };
    case STUDENT_LESSONS_CREATE_SUCCESS:
      return { ...state, lessonCreated: true };
    case STUDENT_LESSONS_CREATE_CLEAR:
      return { ...state, lessonCreated: false };
    case STUDENT_LESSONS_UPDATE:
      // Update in both lists if present
      return {
        ...state,
        past_lessons: {
          ...state.past_lessons,
          lessons: (state.past_lessons.lessons || []).map(l => l.id === action.payload.id ? action.payload : l)
        },
        upcoming_lessons: {
          ...state.upcoming_lessons,
          lessons: (state.upcoming_lessons.lessons || []).map(l => l.id === action.payload.id ? action.payload : l)
        }
      };
    case STUDENT_LESSONS_UPDATE_SUCCESS:
      return { ...state, lessonUpdated: true };
    case STUDENT_LESSONS_UPDATE_CLEAR:
      return { ...state, lessonUpdated: false };
    case STUDENT_LESSONS_DELETE:
      // Remove from both lists
      return {
        ...state,
        past_lessons: {
          ...state.past_lessons,
          lessons: (state.past_lessons.lessons || []).filter(l => l.id !== action.payload)
        },
        upcoming_lessons: {
          ...state.upcoming_lessons,
          lessons: (state.upcoming_lessons.lessons || []).filter(l => l.id !== action.payload)
        }
      };
    default:
      return state;
  }
};

const insertLesson = (lessons, payload) => {
  lessons = lessons.slice();
  lessons.push(payload);
  return lessons;
};

const updateLesson = (lessons, payload) => {
  return lessons.map(item => {
    if (item.id !== payload.id) {
      return item;
    }
    return {
      ...item,
      ...payload
    };
  });
};

const removeLesson = (lessons, payload) => {
  return lessons.filter(item => item.id !== payload.id);
};
