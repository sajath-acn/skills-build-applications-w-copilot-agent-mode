import React, { useCallback, useEffect, useState } from 'react';

const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Details</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <dl className="row mb-0">
                <dt className="col-sm-4">Username</dt>
                <dd className="col-sm-8">{user.username}</dd>
                <dt className="col-sm-4">Email</dt>
                <dd className="col-sm-8">{user.email || 'N/A'}</dd>
                <dt className="col-sm-4">Active</dt>
                <dd className="col-sm-8">{user.is_active ? 'Yes' : 'No'}</dd>
                <dt className="col-sm-4">Staff</dt>
                <dd className="col-sm-8">{user.is_staff ? 'Yes' : 'No'}</dd>
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError('');
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
      })
      .catch(err => setError('Unable to load users.'))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(user =>
        [user.username, user.email].join(' ').toLowerCase().includes(keyword)
      )
    );
  }, [users, searchTerm]);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Users</h2>
          <p className="text-muted mb-0">Browse members and staff information.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={fetchUsers}>Refresh</button>
      </div>
      <div className="card-body">
        <form className="row g-3 mb-4" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label htmlFor="userSearch" className="form-label visually-hidden">Search users</label>
            <input
              id="userSearch"
              type="search"
              className="form-control"
              placeholder="Search by username or email"
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
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Active</th>
                  <th scope="col">Staff</th>
                  <th scope="col" className="text-end">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <tr key={user.id || idx}>
                      <td>{user.username}</td>
                      <td>{user.email || '—'}</td>
                      <td>{user.is_active ? 'Yes' : 'No'}</td>
                      <td>{user.is_staff ? 'Yes' : 'No'}</td>
                      <td className="text-end">
                        <button type="button" className="btn btn-link p-0" onClick={() => setSelectedUser(user)}>
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default Users;
