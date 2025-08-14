import { useState } from 'react';
import AddGig from '../add_gig/AddGig';
import './gigs.css';

const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  return words.length > numWords
    ? words.slice(0, numWords).join(' ') + '...'
    : text;
};

const MyGigs = ({ gig, onEdit, onDelete }) => {
  const [showGigPopup, setShowGigPopup] = useState(false);

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
      
      <div className="gig-actions" style={{ color: '#6d6d6d' }}>
        <button className="gig-action-btn gig-edit-btn">
          <span className="gig-action-icon">✏️</span> Edit
        </button>
      
        |
     
        <button className="gig-action-btn gig-delete-btn">
          <span className="gig-action-icon">🗑️</span> Delete
        </button>
        <AddGig open={showGigPopup} onClose={closeGigPopup} onSubmit={handleGigSubmit} gig={null} />
      </div>
    </div>
  );
};

export default MyGigs;