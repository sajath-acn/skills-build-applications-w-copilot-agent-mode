import React, { useCallback, useEffect, useState } from 'react';

const WorkoutModal = ({ workout, onClose }) => {
  if (!workout) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Workout Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <dl className="row mb-0">
                <dt className="col-sm-4">Workout</dt>
                <dd className="col-sm-8">{workout.name}</dd>
                <dt className="col-sm-4">Difficulty</dt>
                <dd className="col-sm-8">{workout.difficulty}</dd>
              </dl>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  const fetchWorkouts = useCallback(() => {
    setLoading(true);
    setError('');
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setWorkouts(results);
      })
      .catch(err => setError('Unable to load workouts.'))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    setFilteredWorkouts(
      workouts.filter(workout =>
        [workout.name, workout.difficulty].join(' ').toLowerCase().includes(keyword)
      )
    );
  }, [workouts, searchTerm]);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Workouts</h2>
          <p className="text-muted mb-0">Explore workout routines and challenge levels.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={fetchWorkouts}>Refresh</button>
      </div>
      <div className="card-body">
        <form className="row g-3 mb-4" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label htmlFor="workoutSearch" className="form-label visually-hidden">Search workouts</label>
            <input
              id="workoutSearch"
              type="search"
              className="form-control"
              placeholder="Search workouts"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear search
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Workout</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col" className="text-end">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.length > 0 ? (
                  filteredWorkouts.map((workout, idx) => (
                    <tr key={workout.id || idx}>
                      <td>{workout.name}</td>
                      <td>{workout.difficulty}</td>
                      <td className="text-end">
                        <button type="button" className="btn btn-link p-0" onClick={() => setSelectedWorkout(workout)}>
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">No workouts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <WorkoutModal workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
    </div>
  );
};

export default Workouts;
