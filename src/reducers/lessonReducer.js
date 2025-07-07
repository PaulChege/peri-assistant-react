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

const INITIAL_STATE = { lessonCreated: false, lessonUpdated: false, lessons: [] };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STUDENT_LESSONS_LIST:
      return { ...state, lessons: action.payload };
    case STUDENT_LESSONS_SHOW:
      return { ...state, lessons: [action.payload] };
    case STUDENT_LESSONS_CREATE:
      return { ...state, lessons: insertLesson(state.lessons, action.payload) };
    case STUDENT_LESSONS_CREATE_SUCCESS:
      return { ...state, lessonCreated: true };
    case STUDENT_LESSONS_CREATE_CLEAR:
      return { ...state, lessonCreated: false };
    case STUDENT_LESSONS_UPDATE:
      return { ...state, lessons: updateLesson(state.lessons, action.payload) };
    case STUDENT_LESSONS_UPDATE_SUCCESS:
      return { ...state, lessonUpdated: true };
    case STUDENT_LESSONS_UPDATE_CLEAR:
      return { ...state, lessonUpdated: false };
    case STUDENT_LESSONS_DELETE:
      return { ...state, lessons: removeLesson(state.lessons, action.payload) };
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
