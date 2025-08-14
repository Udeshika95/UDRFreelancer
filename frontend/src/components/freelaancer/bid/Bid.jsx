import { useEffect, useState } from 'react';
import './bid.css';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../axiosConfig';

const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  return words.length > numWords
    ? words.slice(0, numWords).join(' ') + '...'
    : text;
};

const Bid = ({ bid }) => {

  const { user } = useAuth();
  const token = user?.token;
  const [freelancer, setUser] = useState('');

  useEffect(() => {
    console.log('token ' + token)
    fetchFreelancer()
  }, [token]);

  const fetchFreelancer = async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/profile/${bid.freelancerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);

    }
  };

  return (
    <div className="bid-card">
      <div className="bid-header">
        <div className="bid-user">
          <img
            src={bid.avatar || 'https://ui-avatars.com/api/?name=' + freelancer.name}
            alt="avatar"
            className="bid-avatar"
          />
          <span className="bid-username">{freelancer.name}</span>
        </div>
        <span className="bid-range">${bid.minBid} - ${bid.maxBid}</span>
      </div>
      <div className="bid-description">
        {truncateWords(bid.description, 100)}
      </div>
      <div className="bid-actions">
        <button className="bid-view-btn">View More</button>
      </div>
    </div>
  );
};

export default Bid;