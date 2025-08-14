import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './bid.form.css';
import axiosInstance from '../../../axiosConfig';

const BidForm = ({ open, onClose, gigId, bid, onUpdate }) => {

    const initialState = {
        minBidRange: '',
        maxBidRange: '',
        message: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState(null);
    const { user } = useAuth();
    const token = user?.token;
    const userId = user?.id;

    useEffect(() => {
        if (bid) {
            setFormData({
                minBidRange: bid.minBid || '',
                maxBidRange: bid.maxBid || '',
                message: bid.description || '',
            });
        } else {
            setFormData(initialState);
        }
    }, [bid]);

    if (!open) return null;

    const validate = (data) => {
        const err = {};
        if (!data.minBidRange) err.minBidRange = 'Minimum bid required.';
        if (!data.maxBidRange) err.maxBidRange = 'Maximum bid required.';
        if (Number(data.minBidRange) > Number(data.maxBidRange)) err.maxBidRange = 'Max bid must be greater than min bid.';
        if (!data.message.trim()) err.message = 'Message required.';
        return err;
    };

    const clearForm = () => {
        setFormData(initialState);
        setErrors({});
        setServerMessage(null);
    };

    const handleClose = () => {
        clearForm();
        if (onClose) onClose();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        setServerMessage(null);
        if (Object.keys(validationErrors).length === 0) {

            try {
                if (bid) {
                    await axiosInstance.put(`/api/freelancer/updateBidById/${bid._id}`, {
                        freelancerId: userId,
                        gigId: gigId,
                        minBid: formData.minBidRange,
                        maxBid: formData.maxBidRange,
                        description: formData.message
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setServerMessage({ type: 'success', text: 'Bid Updeted successfully!' });
                } else {
                    await axiosInstance.post('/api/freelancer/saveBid', {
                        freelancerId: userId,
                        gigId: gigId,
                        minBid: formData.minBidRange,
                        maxBid: formData.maxBidRange,
                        description: formData.message
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    setServerMessage({ type: 'success', text: 'Bid submitted successfully!' });
                }

                setTimeout(() => {
                    setServerMessage(null);
                    //if(bid){
                        onUpdate()
                    //}
                    handleClose();
                }, 1500);
            } catch (error) {
                if (bid) {
                    setServerMessage({ type: 'error', text: 'Failed to update bid. Please try again.' });
                } else {
                    setServerMessage({ type: 'error', text: 'Failed to submit bid. Please try again.' });

                }
            }
        }
    };

    return (
        <div className="bid-form-modal-overlay">
            <div className="bid-form-modal">
                <button
                    onClick={handleClose}
                    className="bid-form-close-btn"
                    aria-label="Close"
                >✖</button>
                <form onSubmit={handleSubmit}>
                    <h2 className="bid-form-title">{bid ? "Update Your Bid" : "Place Your Bid"}</h2>
                    {serverMessage && (
                        <div
                            style={{
                                marginBottom: 12,
                                color: serverMessage.type === 'success' ? 'green' : 'red',
                                fontWeight: 500,
                                textAlign: 'center'
                            }}
                        >
                            {serverMessage.text}
                        </div>
                    )}
                    <div style={{ marginBottom: 16 }}>
                        <label className="bid-form-label">Min Bid Range</label>
                        <input
                            name="minBidRange"
                            type="number"
                            value={formData.minBidRange}
                            onChange={handleChange}
                            className="bid-form-input"
                        />
                        {errors.minBidRange && <div className="bid-form-error">{errors.minBidRange}</div>}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label className="bid-form-label">Max Bid Range</label>
                        <input
                            name="maxBidRange"
                            type="number"
                            value={formData.maxBidRange}
                            onChange={handleChange}
                            className="bid-form-input"
                        />
                        {errors.maxBidRange && <div className="bid-form-error">{errors.maxBidRange}</div>}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label className="bid-form-label">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="bid-form-textarea"
                            rows={5}
                        />
                        {errors.message && <div className="bid-form-error">{errors.message}</div>}
                    </div>
                    <div className="bid-form-submit-row">
                        <button
                            type="submit"
                            className="bid-form-submit-btn"
                        >
                            {bid ? "Update" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BidForm;