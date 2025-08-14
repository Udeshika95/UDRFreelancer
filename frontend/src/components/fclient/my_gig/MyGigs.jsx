import { useState, useEffect } from 'react';
import AddGig from '../add_gig/AddGig';
import './gigs.css';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../../context/AuthContext';
import Bid from '../../freelaancer/bid/Bid'

const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  return words.length > numWords
    ? words.slice(0, numWords).join(' ') + '...'
    : text;
};

const MyGigs = ({ gig, onEdit, onDelete }) => {
  const [showGigPopup, setShowGigPopup] = useState(false);
  const [bids, setBids] = useState([]);
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    console.log('token ' + token)
    fetchBidsByGigId()
  }, [token]);

  const openGigPopup = () => {
    setShowGigPopup(true);
  };

  // Method to close gig popup
  const closeGigPopup = () => {
    setShowGigPopup(false);

  };

  const handleGigSubmit = () => {

  }

  const onDeleteBid = () => {
    fetchBidsByGigId()
  }
  const fetchBidsByGigId = async () => {
    try {
      const response = await axiosInstance.get(`/api/freelancer/getBidByGigId/${gig._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    }
  }

  return (
    <div className="gig-client-card" style={{ marginBottom: '1rem' }}>
      <div className="gig-header">
        <h2 className="gig-title">{gig.gigName}</h2>
        <span className="gig-budget">${gig.minGigBudget} - ${gig.maxGigBudget}</span>
      </div>
      <div className="gig-description" style={{ width: '90%' }}>
        {truncateWords(gig.gigDescription, 100)}
      </div>
      <div style={{ width: '100%', marginTop: '1.5rem' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', color: '#2563eb' }}>
          Available Bids
        </h3>
        {bids.length === 0 ? (
          <div style={{ color: '#64748b', fontStyle: 'italic', marginBottom: '50px' }}>No bids yet.</div>
        ) : (
          bids.map(bid => (
            <Bid key={bid.bidId} bid={bid} onDelete={() => onDeleteBid()} onClose={() => onDeleteBid()} />
          ))
        )}
      </div>

      <div className="gig-actions" style={{ color: '#6d6d6d' }}>
        <button className="gig-action-btn gig-edit-btn" onClick={() => onEdit && onEdit(gig)}>
          <span className="gig-action-icon">✏️</span> Edit
        </button>
        |
        <button className="gig-action-btn gig-delete-btn" onClick={() => onDelete && onDelete(gig)}>
          <span className="gig-action-icon" >🗑️</span> Delete
        </button>
        <AddGig open={showGigPopup} onClose={closeGigPopup} onSubmit={handleGigSubmit} gig={null} />
      </div>
    </div>
  );
};

export default MyGigs;