import React, { useCallback, useEffect, useState } from 'react';

const TeamModal = ({ team, onClose }) => {
  if (!team) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Team Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <dl className="row mb-0">
                <dt className="col-sm-4">Team Name</dt>
                <dd className="col-sm-8">{team.name}</dd>
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

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  const fetchTeams = useCallback(() => {
    setLoading(true);
    setError('');
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
      })
      .catch(err => setError('Unable to load teams.'))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    setFilteredTeams(
      teams.filter(team => team.name.toLowerCase().includes(keyword))
    );
  }, [teams, searchTerm]);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Teams</h2>
          <p className="text-muted mb-0">Browse team rosters and performance groups.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={fetchTeams}>Refresh</button>
      </div>
      <div className="card-body">
        <form className="row g-3 mb-4" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label htmlFor="teamSearch" className="form-label visually-hidden">Search teams</label>
            <input
              id="teamSearch"
              type="search"
              className="form-control"
              placeholder="Search teams"
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
                  <th scope="col">Team Name</th>
                  <th scope="col" className="text-end">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team, idx) => (
                    <tr key={team.id || idx}>
                      <td>{team.name}</td>
                      <td className="text-end">
                        <button type="button" className="btn btn-link p-0" onClick={() => setSelectedTeam(team)}>
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-muted">No teams found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </div>
  );
};

export default Teams;
