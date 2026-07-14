import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRosters, getChangesByRosterId, deleteRoster } from '../../utils/storage';
import { Roster } from '../../types';
import Navigation from '.././common/Navigation';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadRosters();
  }, []);

  const loadRosters = () => {
    const loadedRosters = getRosters();
    // Sort by creation date (newest first)
    loadedRosters.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRosters(loadedRosters);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getChangeCount = (rosterId: string): number => {
    const changes = getChangesByRosterId(rosterId);
    return changes.length;
  };

  const handleViewRoster = (rosterId: string) => {
    navigate(`/roster/${rosterId}`);
  };

  const handleDeleteRoster = (rosterId: string) => {
    setDeleteConfirm(rosterId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      try {
        deleteRoster(deleteConfirm);
        loadRosters(); // Refresh the list
        setDeleteConfirm(null);
        alert('Roster deleted successfully!');
      } catch (error) {
        console.error('Error deleting roster:', error);
        alert('Failed to delete roster. Please try again.');
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div style={loadingContainerStyle}>
          <p>Loading rosters...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1>My Rosters ({rosters.length})</h1>
          <Link to="/create-roster">
            <button style={createButtonStyle}>+ Create New Roster</button>
          </Link>
        </div>

        {rosters.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={emptyTextStyle}>
              No roster available at the moment.
            </p>
            <p style={emptySubTextStyle}>
              Click the button above to create your first roster.
            </p>
          </div>
        ) : (
          <div style={rosterGridStyle}>
            {rosters.map((roster) => (
              <div key={roster.id} style={rosterCardStyle}>
                <div style={rosterHeaderStyle}>
                  <h3 style={rosterTitleStyle}>
                    {roster.name}
                  </h3>
                  <span style={changeCountStyle}>
                    {getChangeCount(roster.id)} changes
                  </span>
                </div>
                
                <div style={rosterInfoStyle}>
                  <p style={rosterDateStyle}>
                    <strong>Period:</strong> {formatDate(roster.startDate)} - {formatDate(roster.endDate)}
                  </p>
                  <p>
                    <strong>Employees:</strong> {roster.employees.length}
                  </p>
                  <p>
                    <strong>Created:</strong> {formatDate(roster.createdAt)}
                  </p>
                  {roster.updatedAt && (
                    <p>
                      <strong>Updated:</strong> {formatDate(roster.updatedAt)}
                    </p>
                  )}
                  <p>
                    <strong>Version:</strong> {roster.currentVersion}
                  </p>
                </div>

                <div style={cardButtonGroupStyle}>
                  <button 
                    onClick={() => handleViewRoster(roster.id)}
                    style={viewButtonStyle}
                  >
                    View Roster
                  </button>
                  <button 
                    onClick={() => handleDeleteRoster(roster.id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={modalOverlayStyle} onClick={cancelDelete}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>⚠️ Delete Roster</h3>
            <p style={modalTextStyle}>
              Are you sure you want to delete this roster? This action cannot be undone.
              <br />
              <br />
              <strong>This will permanently delete:</strong>
              <ul style={modalListStyle}>
                <li>The roster metadata</li>
                <li>All snapshots (versions) of this roster</li>
                <li>All change history</li>
              </ul>
            </p>
            <div style={modalButtonGroupStyle}>
              <button 
                onClick={cancelDelete} 
                style={modalCancelButtonStyle}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                style={modalDeleteButtonStyle}
              >
                Yes, Delete Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '30px 20px',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  flexWrap: 'wrap',
  gap: '15px',
};

const createButtonStyle: React.CSSProperties = {
  padding: '12px 25px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
};

const emptyTextStyle: React.CSSProperties = {
  fontSize: '24px',
  color: '#666',
  marginBottom: '10px',
};

const emptySubTextStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#999',
};

const rosterGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
};

const rosterCardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  display: 'flex',
  flexDirection: 'column',
};

const rosterHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '15px',
  gap: '10px',
};

const rosterTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '18px',
  color: '#1e3a5f',
};

const changeCountStyle: React.CSSProperties = {
  backgroundColor: '#e9ecef',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#495057',
  whiteSpace: 'nowrap',
};

const rosterInfoStyle: React.CSSProperties = {
  flex: 1,
  marginBottom: '15px',
  fontSize: '14px',
  lineHeight: '1.8',
};

const rosterDateStyle: React.CSSProperties = {
  marginTop: 0,
};

const cardButtonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
};

const viewButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  backgroundColor: '#1e3a5f',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s',
};

const deleteButtonStyle: React.CSSProperties = {
  flex: 0.5,
  padding: '10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s',
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
  fontSize: '18px',
  color: '#666',
};

// Modal styles
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  maxWidth: '500px',
  width: '100%',
};

const modalTitleStyle: React.CSSProperties = {
  marginBottom: '15px',
  color: '#dc3545',
};

const modalTextStyle: React.CSSProperties = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '20px',
};

const modalListStyle: React.CSSProperties = {
  marginTop: '10px',
  paddingLeft: '20px',
  color: '#666',
};

const modalButtonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  marginTop: '20px',
};

const modalCancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};

const modalDeleteButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};

export default Dashboard;