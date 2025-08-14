import './freelancer.gig.css';

const FreelancerGig = ({
  title = 'Mobile App Development',
  description = 'Build a cross-platform mobile app for our startup. Must have experience with Java, Kotlin, and Android.',
  budget = '$1000 - $2000',
  labels = ['Java', 'Kotlin', 'Android'],
  rating = 4.5,
  onApply,
}) => {
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
      <div className="gig-footer">
        <div className="gig-rating">
          <span>⭐⭐⭐⭐⭐ {rating}</span>
        </div>
        <button className="gig-apply-btn" onClick={()=>onApply && onApply()}>Apply</button>
      </div>
    </div>
  );
};

export default FreelancerGig;