import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">Octofit Tracker</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/activities">Activities</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">Teams</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/users">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">Workouts</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container pb-5">
        <Routes>
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route
            path="/"
            element={
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">Welcome to Octofit Tracker!</h2>
                  <p className="card-text text-muted">
                    Browse activity stats, team standings, workouts, and user profiles using the navigation above.
                  </p>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Link className="btn btn-primary" to="/activities">Activities</Link>
                    <Link className="btn btn-outline-primary" to="/leaderboard">Leaderboard</Link>
                    <Link className="btn btn-outline-primary" to="/teams">Teams</Link>
                    <Link className="btn btn-outline-primary" to="/users">Users</Link>
                    <Link className="btn btn-outline-primary" to="/workouts">Workouts</Link>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
