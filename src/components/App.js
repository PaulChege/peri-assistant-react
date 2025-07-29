import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Login from "./LogIn";
import UserCreate from "./users/UserCreate";
import UserEdit from "./users/UserEdit";
import StudentList from "./students/StudentList";
import StudentCreate from "./students/StudentCreate";
import StudentEdit from "./students/StudentEdit";
import LessonList from "./lessons/LessonList";
import AllLessons from "./lessons/AllLessons";
import LessonCreate from "./lessons/LessonCreate";
import LessonEdit from "./lessons/LessonEdit";
import Header from "./Header";
import CalendarView from "./CalendarView";
import { getToken } from "../auth/auth";
import { connect } from "react-redux";
import { clearFlash } from "../actions/flash";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App({ flash, clearFlash }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    if (token == null && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => clearFlash(), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash, clearFlash]);

  // Only show Header/sidebar if not on login or signup
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      {!hideSidebar && <Header />}
      {flash && (
        <div className="alert alert-success" role="alert">
          <p>{flash}</p>
        </div>
      )}
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<UserCreate />} />
        <Route path="/user" element={<UserEdit />} />
        <Route path="/student/create" element={<StudentCreate />} />
        <Route path="/student/:id/edit" element={<StudentEdit />} />
        <Route path="/student/:id/lessons" element={<LessonList />} />
        <Route path="/student/:id/lessons/create" element={<LessonCreate />} />
        <Route path="/student/:studentId/lesson/:id/edit" element={<LessonEdit />} />
        <Route path="/lesson/:id/edit" element={<LessonEdit />} />
        <Route path="/lessons" element={<AllLessons />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { flash: state.flash.message };
};

const ConnectedApp = connect(mapStateToProps, { clearFlash })(App);

const CLIENT_ID = "420797426729-kn0ggevqk789epdaic6mgev40gg0e5ch.apps.googleusercontent.com";

export default function AppWithRouter() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <ConnectedApp />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
