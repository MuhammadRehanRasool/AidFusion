import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./views/Home";
import Layout from "./layout/Layout";
import TakeMeToAdmin from "./components/TakeMeToAdmin";
import "./App.css"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/admin" element={<TakeMeToAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
