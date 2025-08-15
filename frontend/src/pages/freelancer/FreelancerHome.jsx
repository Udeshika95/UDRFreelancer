import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import FreelancerGig from '../../components/freelaancer/show_gigs/FreelancerGig';
import './freelancer.home.css';
import { useAuth } from '../../context/AuthContext';
import BidForm from '../../components/freelaancer/bid/BidForm'

const FreelancerHome = () => {
    const [gigs, setGigs] = useState([]);
    const [bidFormState, setFormState] = useState(false);
    const [gig, setSelectedGig] = useState(false);

    const { user } = useAuth();
    const token = user?.token;
    const userId = user?.id;

    useEffect(() => {

        fetchGigs()
    }, [userId, token]);

    const handleApply = (gig) => {
        setFormState(true)
        setSelectedGig(gig)
    };

    const onBidUpdate = () => {
        console.log("Updated")
        fetchGigs()
    }
    const fetchGigs = async () => {
        try {
            console.log('Fetching gigs for freelancer home');
            const response = await axiosInstance.get(`/api/client/viewAllGigs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGigs(response.data);
            console.log('Fetched gigs:', gigs);
        } catch (error) {
            console.error('Error fetching gigs:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh' }}
        >
            {gigs.length > 0 ? (
                gigs.map((gig, idx) => (
                    <FreelancerGig
                        gigId={gig._id}
                        key={idx}
                        title={gig.gigName}
                        description={gig.gigDescription}
                        budget={`$${gig.minGigBudget} - $${gig.maxGigBudget}`}
                        labels={gig.skills}
                        rating={5}
                        onApply={() => handleApply(gig)}
                    />
                ))
            ) : (
                <div style={{ color: '#6d6d6d', fontStyle: 'italic', marginTop: '2rem', fontSize: '1.2rem' }}>
                    No gigs available at the moment.
                </div>
            )}

            <BidForm open={bidFormState} onClose={() => { setFormState(false) }} gigId={gig._id} onUpdate={() => onBidUpdate()} />

        </div>
    );

};

export default FreelancerHome;