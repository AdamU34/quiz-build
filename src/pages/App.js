import React from "react";
import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";

import PrivateRoute from "../components/PrivateRoute";

import UserDashboardPage from "./UserDashboardPage";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import CreateQuizPage from "./CreateQuizPage";
import ViewQuizPage from "./ViewQuizPage";

import "./App.css";
import NotFoundPage from "./NotFoundPage";

function App() {
  return (
    <Container className="App">
      {/* <NavBar /> */}
      <div className="Container">
        <AuthProvider>
          <Router>
            <Routes>
              <Route
                index
                element={
                  <PrivateRoute>
                    <UserDashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="create-quiz"
                element={
                  <PrivateRoute>
                    <CreateQuizPage />
                  </PrivateRoute>
                }
              />
              <Route path="signup" element={<SignupPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="start-quiz/:linkCode" element={<ViewQuizPage />} />
              <Route path="notFound" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate replace to="/notFound" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </Container>
  );
}

export default App;
