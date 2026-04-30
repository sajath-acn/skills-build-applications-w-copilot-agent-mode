import React, { useCallback, useEffect, useState } from 'react';

const ActivityModal = ({ activity, onClose }) => {
  if (!activity) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Activity Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <dl className="row mb-0">
                <dt className="col-sm-4">User</dt>
                <dd className="col-sm-8">{activity.user}</dd>
                <dt className="col-sm-4">Type</dt>
                <dd className="col-sm-8">{activity.type}</dd>
                <dt className="col-sm-4">Duration</dt>
                <dd className="col-sm-8">{activity.duration} min</dd>
                <dt className="col-sm-4">Team</dt>
                <dd className="col-sm-8">{activity.team}</dd>
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

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  const fetchActivities = useCallback(() => {
    setLoading(true);
    setError('');
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
      })
      .catch(err => setError('Unable to load activities.'))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    setFilteredActivities(
      activities.filter(activity =>
        [activity.user, activity.type, activity.team]
          .join(' ')
          .toLowerCase()
          .includes(keyword)
      )
    );
  }, [activities, searchTerm]);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Activities</h2>
          <p className="text-muted mb-0">View recent activity sessions and explore details.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={fetchActivities}>Refresh</button>
      </div>
      <div className="card-body">
        <form className="row g-3 mb-4" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label htmlFor="activitySearch" className="form-label visually-hidden">Search activities</label>
            <input
              id="activitySearch"
              type="search"
              className="form-control"
              placeholder="Search by user, type, or team"
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
                  <th scope="col">User</th>
                  <th scope="col">Type</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Team</th>
                  <th scope="col" className="text-end">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity, idx) => (
                    <tr key={activity.id || idx}>
                      <td>{activity.user}</td>
                      <td>{activity.type}</td>
                      <td>{activity.duration} min</td>
                      <td>{activity.team}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-link p-0"
                          onClick={() => setSelectedActivity(activity)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No activities found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
    </div>
  );
};

export default Activities;
