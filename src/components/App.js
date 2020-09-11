import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Login from "./LogIn";
import UserCreate from "./users/UserCreate";
import UserEdit from "./users/UserEdit";
import StudentList from "./students/StudentList";
import StudentCreate from "./students/StudentCreate";
import StudentEdit from "./students/StudentEdit";
import LessonList from "./lessons/LessonList";
import LessonCreate from "./lessons/LessonCreate";
import LessonEdit from "./lessons/LessonEdit";
import history from "../history";
import Header from "./Header";
import { getToken } from "../auth/auth";
import { connect } from "react-redux";
import { clearFlash } from "../actions/flash";

class App extends React.Component {
  componentDidMount() {
    const token = getToken();
    if (token == null) {
      history.push("/login");
    }
  }

  clearFlash = () => {
    setTimeout(() => this.props.clearFlash(), 5000);
  };

  render() {
    return (
      <div>
        <Router history={history}>
          <Header />
          {this.props.flash && (
            <div className="alert alert-success" role="alert">
              <p>{this.props.flash}</p>
            </div>
          )}

          {this.clearFlash()}
          <Switch>
            <Route path="/" exact component={StudentList} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={UserCreate} />
            <Route path="/user" exact component={UserEdit} />
            <Route path="/student/create" exact component={StudentCreate} />
            <Route path="/student/:id/edit" exact component={StudentEdit} />
            <Route path="/student/:id/lessons" exact component={LessonList} />
            <Route
              path="/student/:id/lessons/create"
              exact
              component={LessonCreate}
            />
            <Route
              path="/student/:studentId/lesson/:id/edit"
              exact
              component={LessonEdit}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { flash: state.flash.message };
};

export default connect(mapStateToProps, { clearFlash })(App);
