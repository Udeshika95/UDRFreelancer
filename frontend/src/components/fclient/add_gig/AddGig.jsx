import { useState, useEffect } from 'react';
import './add.gig.css';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../../context/AuthContext';

const SKILLS = [
    'Java', 'Kotlin', 'Android', 'AndroidSDK', 'Node.js',
    'Web Development', 'React', 'Express', 'MongoDB', 'Figma',
    'UI', 'UX', 'AWS', 'Docker', 'CI/CD', 'Python', 'Django', 'Flask',
    'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL', 'PostgreSQL',
    'MySQL', 'GraphQL', 'RESTful APIs', 'Git',
];

const validate = (data) => {
    const errors = {};
    if (!data.gigName.trim()) errors.gigName = 'Gig name is required.';
    if (!data.gigDescription.trim()) errors.gigDescription = 'Description is required.';
    if (!data.minGigBudget) errors.minGigBudget = 'Minimum budget required.';
    if (!data.maxGigBudget) errors.maxGigBudget = 'Maximum budget required.';
    if (Number(data.minGigBudget) > Number(data.maxGigBudget)) errors.maxGigBudget = 'Max budget must be greater than min budget.';
    if (data.skills.length === 0) errors.skills = 'Select at least one skill.';
    return errors;
};

const AddGig = ({ open, onClose, onSubmit, gig }) => {
    const { user } = useAuth();
    const token = user?.token;
    const initialFormState = {
        gigName: '',
        gigDescription: '',
        minGigBudget: '',
        maxGigBudget: '',
        skills: [],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [serverMessage, setServerMessage] = useState(null);

    useEffect(() => {
        if (gig) {
            setFormData({
                gigName: gig.gigName || '',
                gigDescription: gig.gigDescription || '',
                minGigBudget: gig.minGigBudget || '',
                maxGigBudget: gig.maxGigBudget || '',
                skills: gig.skills || [],
            });
        } else {
            setFormData(initialFormState);
        }
    }, [gig, open]);

    if (!open) return null;

    const handleSkillAdd = (skill) => {
        if (!formData.skills.includes(skill)) {
            setFormData({ ...formData, skills: [...formData.skills, skill] });
        }
        setSkillInput('');
        setShowSuggestions(false);
    };

    const handleSkillRemove = (skill) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkillInput = (e) => {
        setSkillInput(e.target.value);
        setShowSuggestions(true);
    };

    // Method to clear all form data and chips
    const clearForm = () => {
        setFormData(initialFormState);
        setSkillInput('');
        setErrors({});
        setShowSuggestions(false);
        setServerMessage(null);
    };

    // Call clearForm when closing popup
    const handleClose = () => {
        clearForm();
        if (onClose) onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        console.log(" token " + token)
        if (Object.keys(validationErrors).length === 0) {
            try {
                if (gig) {
                    await axiosInstance.put(`/api/client/editGig/${gig._id}`, formData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setServerMessage({ type: 'success', text: 'Gig updated successfully!' });
                } else {
                    await axiosInstance.post('/api/client/saveGig', formData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setServerMessage({ type: 'success', text: 'Gig submitted successfully!' });

                }

                if (onSubmit) onSubmit(formData);
                setTimeout(() => {
                    setServerMessage(null);
                    onClose();
                }, 4000);
            } catch (error) {
                setServerMessage({ type: 'error', text: 'Failed to submit gig. Please try again.' });
            }
        }
    };

    const filteredSkills = SKILLS.filter(
        skill => skill.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(skill)
    );

    return (
        <div className="add-gig-modal-overlay">
            <div className="add-gig-modal">
                <button
                    onClick={handleClose}
                    className="add-gig-close-btn"
                    aria-label="Close"
                >✖</button>
                <form onSubmit={handleSubmit}>
                    <h2 className="add-gig-title">{gig ? "Edit Gig" : "Add New Gig"}</h2>
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
                        <label className="add-gig-label">Gig Name</label>
                        <input
                            name="gigName"
                            type="text"
                            value={formData.gigName}
                            onChange={handleChange}
                            className="add-gig-input"
                        />
                        {errors.gigName && <div className="add-gig-error">{errors.gigName}</div>}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label className="add-gig-label">Gig Description</label>
                        <textarea
                            rows="3"
                            name="gigDescription"
                            value={formData.gigDescription}
                            onChange={handleChange}
                            className="add-gig-textarea"
                        />
                        {errors.gigDescription && <div className="add-gig-error">{errors.gigDescription}</div>}
                    </div>
                    <div className="add-gig-budget-row">
                        <div className="add-gig-budget-col">
                            <label className="add-gig-label">Min Budget</label>
                            <input
                                name="minGigBudget"
                                type="number"
                                value={formData.minGigBudget}
                                onChange={handleChange}
                                className="add-gig-input"
                            />
                            {errors.minGigBudget && <div className="add-gig-error">{errors.minGigBudget}</div>}
                        </div>
                        <div className="add-gig-budget-col">
                            <label className="add-gig-label">Max Budget</label>
                            <input
                                name="maxGigBudget"
                                type="number"
                                value={formData.maxGigBudget}
                                onChange={handleChange}
                                className="add-gig-input"
                            />
                            {errors.maxGigBudget && <div className="add-gig-error">{errors.maxGigBudget}</div>}
                        </div>
                    </div>
                    <div style={{ marginBottom: 16, position: 'relative' }}>
                        <label className="add-gig-label">Skill Set</label>
                        <input
                            type="text"
                            value={skillInput}
                            onChange={handleSkillInput}
                            onFocus={() => setShowSuggestions(true)}
                            className="add-gig-input"
                            placeholder="Type to search skills..."
                        />
                        {showSuggestions && skillInput && filteredSkills.length > 0 && (
                            <div className="add-gig-skill-suggestions">
                                {filteredSkills.map(skill => (
                                    <div
                                        key={skill}
                                        className="add-gig-skill-suggestion"
                                        onClick={() => handleSkillAdd(skill)}
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.skills && <div className="add-gig-error">{errors.skills}</div>}
                    </div>
                    <div className="add-gig-chips-row">
                        {formData.skills.map(skill => (
                            <div key={skill} className="add-gig-chip">
                                {skill}
                                <span
                                    className="add-gig-chip-remove"
                                    onClick={() => handleSkillRemove(skill)}
                                    aria-label="Remove"
                                >✖</span>
                            </div>
                        ))}
                    </div>
                    <div className="add-gig-submit-row">
                        <button
                            type="submit"
                            className="add-gig-submit-btn"
                        >
                            {gig ? "Update" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGig;