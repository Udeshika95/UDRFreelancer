import './freelancer.gig.css';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../../context/AuthContext';
import Bid from '../../freelaancer/bid/Bid'


const FreelancerGig = ({
  gigId = '',
  title = 'Mobile App Development',
  description = 'Build a cross-platform mobile app for our startup. Must have experience with Java, Kotlin, and Android.',
  budget = '$1000 - $2000',
  labels = ['Java', 'Kotlin', 'Android'],
  rating = 4.5,
  onApply,
}) => {

  const { user } = useAuth();
  const token = user?.token;
  const userId = user?.id;

  const [bids, setBids] = useState([]);
  const userBids = bids.filter(bid => bid.freelancerId === userId);
  
  useEffect(() => {
    console.log('token ' + token)
    fetchBidsByGigId()
  }, [token]);

  const fetchBidsByGigId = async () => {
    try {
      const response = await axiosInstance.get(`/api/freelancer/getBidByGigId/${gigId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    }
  }

  const onDeleteBid = () => {
    fetchBidsByGigId()
  }

  const onUpdateBid= () => {
    fetchBidsByGigId()
  }

  return (
    <div className="gig-card">
      <div className="gig-header">
        <h2 className="gig-title">{title}</h2>
        <span className="gig-budget">{budget}</span>
      </div>
      <div className="gig-description">{description}</div>
      <div className="gig-labels">
        {labels.map((label) => (
          <span key={label} className="gig-label">{label}</span>
        ))}
      </div>
      {userBids.length > 0 && (
      <div style={{ width: '100%', marginTop: '1.5rem' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', color: '#2563eb' }}>
          Available Bids
        </h3>
        {userBids.map(bid => (
          <Bid
            key={bid.bidId}
            bid={bid}
            onDelete={() => onDeleteBid()}
            onUpdate={() => onUpdateBid()}
          />
        ))}
      </div>
    )}
      <div className="gig-footer">
        <div className="gig-rating">
          <span>⭐⭐⭐⭐⭐ {rating}</span>
        </div>
        <button className="gig-apply-btn" onClick={() => onApply && onApply()}>Apply</button>
      </div>
    </div>
  );
};

export default FreelancerGig;