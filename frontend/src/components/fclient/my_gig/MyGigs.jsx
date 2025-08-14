import { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosConfig';
import Bid from '../../freelancer/bids/Bid';
import AddGig from '../add_gig/AddGig';

const dummyBids = [
  {
    bidId: 'b1',
    userId: 'u1',
    userName: 'Alice',
    avatar: '',
    message: 'I have 5 years experience in mobile app development. I can deliver quality work within your budget.',
    bidRange: '$1200 - $1500',
  },
  {
    bidId: 'b2',
    userId: 'u2',
    userName: 'Bob',
    avatar: '',
    message: 'Expert in Java and Kotlin. Ready to start immediately and provide regular updates.',
    bidRange: '$1100 - $1400',
  },
];

const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  return words.length > numWords
    ? words.slice(0, numWords).join(' ') + '...'
    : text;
};

const MyGigs = ({ gig, onEdit, onDelete }) => {
  const [bids, setBids] = useState([]);
  const [showGigPopup, setShowGigPopup] = useState(false);

  useEffect(() => {
    console.log('Fetching bids for gig:', gig.id);
    axiosInstance.get(`/api/gigs/${gig.id}/bids`)
      .then(res => setBids(res.data))
      .catch(() => setBids(dummyBids));
  }, [gig.id]);

  const openGigPopup = () => {
    setShowGigPopup(true);
  };

  // Method to close gig popup
  const closeGigPopup = () => {
    setShowGigPopup(false);

  };

  

  const handleGigSubmit = async (gigData) => {

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
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>No bids yet.</div>
        ) : (
          bids.map(bid => (
            <Bid key={bid.bidId} bid={bid} />
          ))
        )}
      </div>
      <div className="gig-actions" style={{ color: '#6d6d6d' }}>
        <button className="gig-action-btn gig-edit-btn" onClick={() => onEdit && onEdit(gig)}>
          <span className="gig-action-icon">✏️</span> Edit
        </button>
        &nbsp;
        |
        &nbsp;
        <button className="gig-action-btn gig-delete-btn" onClick={() => onDelete && onDelete(gig)}>
          <span className="gig-action-icon">🗑️</span> Delete
        </button>
        <AddGig open={showGigPopup} onClose={closeGigPopup} onSubmit={handleGigSubmit} gig={null} />
      </div>
    </div>
  );
};

export default MyGigs;