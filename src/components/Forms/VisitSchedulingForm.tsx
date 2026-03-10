import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';

interface VisitSchedulingFormProps {
    leadId: string;
    leadName: string;
    agentId: string;
    onClose: () => void;
}

const VisitSchedulingForm: React.FC<VisitSchedulingFormProps> = ({ leadId, leadName, agentId, onClose }) => {
    const { addVisit, updateLeadStatus } = useCRM();
    const [propertyName, setPropertyName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const properties = [
        'Gharpayy PG - Koramangala',
        'Gharpayy PG - HSR Layout',
        'Gharpayy PG - Indiranagar',
        'Gharpayy PG - Whitefield',
        'Gharpayy PG - Marathahalli',
        'Gharpayy PG - Electronic City',
        'Gharpayy PG - BTM Layout',
        'Gharpayy PG - JP Nagar',
    ];

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addVisit({
            leadId,
            leadName,
            propertyName,
            date,
            time,
            outcome: 'Pending',
            agentId
        });
        updateLeadStatus(leadId, 'Visit Scheduled', agentId);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📅 Schedule Visit</h3>
                    <p className="card-subtitle">for {leadName}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Property</label>
                        <select value={propertyName} onChange={e => setPropertyName(e.target.value)} required>
                            <option value="">Choose property...</option>
                            {properties.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Visit Date</label>
                            <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Visit Time</label>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Confirm Visit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VisitSchedulingForm;
