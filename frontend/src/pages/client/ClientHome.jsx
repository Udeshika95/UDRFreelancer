
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './client.home.css';
import AddGig from '../../components/fclient/add_gig/AddGig';
import Toast from '../../components/udr/Toast';
import ErrorToast from '../../components/udr/ErrorToast';

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

    useEffect(() => {
        console.log('userId ' + userId)
        console.log('token ' + token)
        console.log('AddGig:', AddGig);
        console.log('Toast:', Toast);
        console.log('ErrorToast:', ErrorToast);
    }, [userId, token]);


    // Method to open gig popup
    const openGigPopup = () => {
        setShowGigPopup(true);
    };

    // Method to close gig popup
    const closeGigPopup = () => {
        setShowGigPopup(false);
    };

    // Optional: handle gig submit
    const handleGigSubmit = (gigData) => {
        // You can handle gig data here (e.g., send to API)
        closeGigPopup();
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

