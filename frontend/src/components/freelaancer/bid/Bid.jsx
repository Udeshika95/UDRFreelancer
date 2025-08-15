import { useEffect, useState } from 'react';
import './bid.css';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../axiosConfig';
import BidForm from '../../../components/freelaancer/bid/BidForm'

const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  return words.length > numWords
    ? words.slice(0, numWords).join(' ') + '...'
    : text;
};

const Bid = ({ bid, onDelete, onUpdate }) => {

  const { user } = useAuth();
  const token = user?.token;
  const userId = user?.id;

  const [freelancer, setUser] = useState('');
  const [isOpen, setOpenState] = useState(false);

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


  const deleteBid = async () => {
    if (window.confirm('Are you sure you want to delete this Bid?')) {
      try {
        await axiosInstance.delete(`/api/freelancer/deleteBidById/${bid._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onDelete()
      } catch (error) {
        console.error('Error Deleteing bit:', error);
      }
    }
  }

  const onClose = () => {
    setOpenState(false)
    //onUpdate()
  }

  const onUpdateBid = () => {
    onUpdate()
     setOpenState(true)
  }

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
      <div className='bid-actions-extra'>

      </div>
      <div className="bid-actions">
        {bid.freelancerId == userId ? <button className="bid-view-btn-extra" onClick={() => onUpdateBid()}>Edit</button> : <dive></dive>}
        {bid.freelancerId == userId ? <button className="bid-view-btn-extra" onClick={() => deleteBid()}>Delete</button> : <dive></dive>}
        {bid.freelancerId != userId ? <button className="bid-view-btn-extra">Accept</button> : <dive></dive>}
      </div>
      <BidForm open={isOpen} onClose={() => onClose()} gigId={bid.gigId} bid={bid} onUpdate={() => onUpdateBid()} />

    </div >
  );
};

export default Bid;