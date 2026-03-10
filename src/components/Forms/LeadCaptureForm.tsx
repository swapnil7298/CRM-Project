import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { LeadSource } from '../../types';
import { UserPlus, Zap } from 'lucide-react';

const LeadCaptureForm: React.FC = () => {
    const { addLead, agents } = useCRM();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [source, setSource] = useState<LeadSource>('Website Form');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [occupancy, setOccupancy] = useState('');
    const [moveInDate, setMoveInDate] = useState('');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [assignedAgent, setAssignedAgent] = useState<string | null>(null);

    const budgetOptions = [
        '₹5,000 - ₹8,000',
        '₹8,000 - ₹12,000',
        '₹10,000 - ₹15,000',
        '₹12,000 - ₹18,000',
        '₹15,000 - ₹20,000',
        '₹20,000+',
    ];

    const locationOptions = [
        'Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'Marathahalli',
        'Electronic City', 'BTM Layout', 'JP Nagar', 'Bellandur', 'Sarjapur Road'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Find who will get assigned (workload-based)
        const sortedAgents = [...agents].sort((a, b) => a.activeLeads - b.activeLeads);
        const targetAgent = sortedAgents[0];
        setAssignedAgent(targetAgent?.name || 'An agent');

        addLead({ name, phone, email: email || undefined, source, location, budget, occupancy, moveInDate, notes });
        setName(''); setPhone(''); setEmail(''); setLocation('');
        setBudget(''); setOccupancy(''); setMoveInDate(''); setNotes('');
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setAssignedAgent(null); }, 4000);
    };

    return (
        <div className="capture-page">
            <div className="capture-header">
                <div>
                    <h2>Capture New Lead</h2>
                    <p className="capture-subtitle">
                        Mimics automatic ingestion from Tally form, WhatsApp, Calendly, or any source.
                        Lead will be <strong>auto-assigned</strong> via workload balancing.
                    </p>
                </div>
                <div className="auto-assign-badge">
                    <Zap size={14} /> Auto-assign ON
                </div>
            </div>

            {submitted && (
                <div className="success-banner">
                    <UserPlus size={18} />
                    <div>
                        <strong>Lead captured successfully!</strong>
                        {assignedAgent && <span> Auto-assigned to <strong>{assignedAgent}</strong></span>}
                    </div>
                </div>
            )}

            <div className="card form-container-wide">
                <form onSubmit={handleSubmit} className="lead-form-grid">
                    <div className="form-section">
                        <h4 className="form-section-title">Contact Details</h4>
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" placeholder="+91 99999 99999" value={phone} onChange={e => setPhone(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Lead Source *</label>
                            <select value={source} onChange={e => setSource(e.target.value as LeadSource)}>
                                <option value="Website Form">Website Form</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Phone Call">Phone Call</option>
                                <option value="Lead Form">Tally Lead Form</option>
                                <option value="Calendly">Calendly Visit Booking</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4 className="form-section-title">Requirements</h4>
                        <div className="form-group">
                            <label>Preferred Location</label>
                            <select value={location} onChange={e => setLocation(e.target.value)}>
                                <option value="">Select area...</option>
                                {locationOptions.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Budget Range</label>
                            <select value={budget} onChange={e => setBudget(e.target.value)}>
                                <option value="">Select budget...</option>
                                {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Occupancy Type</label>
                            <select value={occupancy} onChange={e => setOccupancy(e.target.value)}>
                                <option value="">Select...</option>
                                <option value="Single">Single</option>
                                <option value="Double Sharing">Double Sharing</option>
                                <option value="Triple Sharing">Triple Sharing</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Expected Move-in Date</label>
                            <input type="date" value={moveInDate} onChange={e => setMoveInDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea placeholder="Any special requirements..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                        </div>
                    </div>
                </form>
                <div className="form-submit-row">
                    <button type="button" className="btn-primary" onClick={handleSubmit as any}>
                        <UserPlus size={16} /> Capture & Auto-Assign Lead
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadCaptureForm;
