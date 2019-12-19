import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Login from "./LogIn";
import UserCreate from "./users/UserCreate";
import history from "../history";
import Header from "./Header";
import StudentList from "./students/StudentList";
import StudentCreate from "./students/StudentCreate";
import StudentEdit from "./students/StudentEdit";
import LessonList from "./lessons/LessonList";

class App extends React.Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <Header />
          <Switch>
            <Route path="/" exact component={StudentList} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={UserCreate} />
            <Route path="/student/create" exact component={StudentCreate} />
            <Route path="/student/:id/edit" exact component={StudentEdit} />
            <Route path="/student/:id/lessons" exact component={LessonList} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
