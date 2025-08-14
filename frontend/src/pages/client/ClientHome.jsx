
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './client.home.css';
import AddGig from '../../components/fclient/add_gig/AddGig';
import Toast from '../../components/udr/Toast';
import ErrorToast from '../../components/udr/ErrorToast';
import axiosInstance from '../../axiosConfig';
import MyGig from '../../components/fclient/my_gig/MyGigs'
const ClientHome = () => {

    const { user } = useAuth();
    const token = user?.token;
    const userId = user?.id;
    const [showGigPopup, setShowGigPopup] = useState(false);
    // Toast state
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastErrorOpen, setToastErrorOpen] = useState(false);
    const [errorMessafe, setToastErrorMsg] = useState('');
    const [gigs, setGigs] = useState([]);

    useEffect(() => {
        console.log('userId ' + userId)
        console.log('token ' + token)
        fetchGigs()
    }, [userId, token]);

    const fetchGigs = async () => {
        try {
            const response = await axiosInstance.get(`/api/client/viewGigs/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGigs(response.data);
        } catch (error) {
            console.error('Error fetching gigs:', error);
            setToastErrorOpen(true)
            setToastErrorMsg("No Gig Found!")
        }
    };

    // Method to open gig popup
    const openGigPopup = () => {
        setShowGigPopup(true);
    };

    // Method to close gig popup
    const closeGigPopup = () => {
        setShowGigPopup(false);
        fetchGigs()
    };

    // Optional: handle gig submit
    const handleGigSubmit = (gigData) => {
        // You can handle gig data here (e.g., send to API)
        closeGigPopup();
    };

    // Delete Gig 
    const deleteGig = async (gig) => {
        // Logic to edit gig
        console.log('Delete gig:', gig);
        if (window.confirm('Are you sure you want to delete this gig?')) {
            try {
                await axiosInstance.delete(`/api/client/deleteGig/${gig._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchGigs();
                // toast message
                setToastOpen(true);
                setToastMsg('Gig deleted successfully!');
            } catch (error) {
                console.error('Error fetching gigs:', error);
                setToastErrorOpen(true);
                setToastErrorMsg('Failed to delete gig. Please try again.');
            }
        }

    };

    return (
        <div className="client-home-container">
            <div className="client-home-header-row">
                <h2 className="section-title">My Posted Gigs</h2>
                <button className="add-gig-btn" onClick={openGigPopup}>
                    <span className="plus-icon">+</span> Add Gig
                </button>
            </div>
            <div className="client-home-main">
                <div className="client-home-left">
                    <div className="gigs-list">
                        {gigs.map(gig => (
                            <MyGig key={gig.id} gig={gig} onDelete={() => deleteGig(gig)} />
                        ))}
                    </div>
                </div>
                <div className="client-home-right">
                    <h2 className="section-title-2">Top Freelancers</h2>

                </div>
                <AddGig open={showGigPopup} onClose={closeGigPopup} onSubmit={handleGigSubmit} />
                <Toast open={toastOpen} message={toastMsg} setOpen={setToastOpen} />
                <ErrorToast open={toastErrorOpen} message={errorMessafe} setErrorOpen={setToastErrorOpen} />
            </div>
        </div>
    );
};

export default ClientHome;

