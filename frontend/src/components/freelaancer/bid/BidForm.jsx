import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './bid.form.css';
import axiosInstance from '../../../axiosConfig';

const BidForm = ({ open, onClose, gig, bid }) => {
    
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
            console.log(gig)
            try {
                await axiosInstance.post('/api/freelancer/saveBid', {
                    freelancerId: userId,
                    gigId: gig._id,
                    minBid: formData.minBidRange,
                    maxBid: formData.maxBidRange,
                    description: formData.message
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServerMessage({ type: 'success', text: 'Bid submitted successfully!' });
                setTimeout(() => {
                    setServerMessage(null);
                    handleClose();
                }, 1500);
            } catch (error) {
                setServerMessage({ type: 'error', text: 'Failed to submit bid. Please try again.' });
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
                    <h2 className="bid-form-title">Place Your Bid</h2>
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
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BidForm;