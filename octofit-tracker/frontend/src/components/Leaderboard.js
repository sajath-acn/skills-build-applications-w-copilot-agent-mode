import React, { useCallback, useEffect, useState } from 'react';

const LeaderModal = ({ leader, onClose }) => {
  if (!leader) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Leaderboard Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <dl className="row mb-0">
                <dt className="col-sm-4">Team</dt>
                <dd className="col-sm-8">{leader.team}</dd>
                <dt className="col-sm-4">Points</dt>
                <dd className="col-sm-8">{leader.points}</dd>
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

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [filteredLeaders, setFilteredLeaders] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  const fetchLeaderboard = useCallback(() => {
    setLoading(true);
    setError('');
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setLeaders(results);
      })
      .catch(err => setError('Unable to load leaderboard.'))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    setFilteredLeaders(
      leaders.filter(leader =>
        [leader.team, String(leader.points)].join(' ').toLowerCase().includes(keyword)
      )
    );
  }, [leaders, searchTerm]);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Leaderboard</h2>
          <p className="text-muted mb-0">Team rankings and points across current challenges.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={fetchLeaderboard}>Refresh</button>
      </div>
      <div className="card-body">
        <form className="row g-3 mb-4" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label htmlFor="leaderboardSearch" className="form-label visually-hidden">Search leaderboard</label>
            <input
              id="leaderboardSearch"
              type="search"
              className="form-control"
              placeholder="Search by team or points"
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
                  <th scope="col">Rank</th>
                  <th scope="col">Team</th>
                  <th scope="col">Points</th>
                  <th scope="col" className="text-end">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaders.length > 0 ? (
                  filteredLeaders.map((leader, idx) => (
                    <tr key={leader.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{leader.team}</td>
                      <td>{leader.points}</td>
                      <td className="text-end">
                        <button type="button" className="btn btn-link p-0" onClick={() => setSelectedLeader(leader)}>
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No leaderboard results found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <LeaderModal leader={selectedLeader} onClose={() => setSelectedLeader(null)} />
    </div>
  );
};

export default Leaderboard;
