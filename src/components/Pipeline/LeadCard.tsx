import React, { useState } from 'react';
import { Lead, Agent } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Calendar, User, Phone, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import VisitSchedulingForm from '../Forms/VisitSchedulingForm';
import LeadDetailModal from './LeadDetailModal';

interface LeadCardProps {
    lead: Lead;
    agents: Agent[];
}

const STAGE_COLORS: Record<string, string> = {
    'New Lead': '#6366f1',
    'Contacted': '#0ea5e9',
    'Requirement Collected': '#8b5cf6',
    'Property Suggested': '#f59e0b',
    'Visit Scheduled': '#ec4899',
    'Visit Completed': '#06b6d4',
    'Booked': '#10b981',
    'Lost': '#ef4444',
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, agents }) => {
    const { updateLeadStatus } = useCRM();
    const [showVisitForm, setShowVisitForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const agentName = agents.find(a => a.id === lead.assignedAgentId)?.name || 'Unassigned';

    const isInactive = (new Date().getTime() - new Date(lead.lastActivityAt).getTime()) > (24 * 60 * 60 * 1000);
    const hoursInactive = Math.floor((Date.now() - new Date(lead.lastActivityAt).getTime()) / 3600000);

    const statuses: Lead['status'][] = [
        'New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested',
        'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'
    ];

    const getTimeAgo = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor(diff / 60000);
        if (h >= 24) return `${Math.floor(h / 24)}d ago`;
        if (h >= 1) return `${h}h ago`;
        return `${m}m ago`;
    };

    return (
        <>
            <div
                className={`lead-card ${isInactive && !['Booked', 'Lost'].includes(lead.status) ? 'inactive' : ''}`}
                style={{ borderLeft: `3px solid ${STAGE_COLORS[lead.status] || '#6366f1'}` }}
            >
                {isInactive && !['Booked', 'Lost'].includes(lead.status) && (
                    <div className="inactive-badge">
                        <AlertCircle size={11} /> {hoursInactive}h inactive
                    </div>
                )}

                <div className="lead-header" onClick={() => setShowDetail(true)} style={{ cursor: 'pointer' }}>
                    <div className="lead-avatar-mini">{lead.name.charAt(0)}</div>
                    <div>
                        <h4>{lead.name}</h4>
                        <div className="lead-source">{lead.source}</div>
                    </div>
                </div>

                <div className="lead-details">
                    <div className="lead-detail-item">
                        <Phone size={13} />
                        <span>{lead.phone}</span>
                    </div>
                    <div className="lead-detail-item">
                        <User size={13} />
                        <span>{agentName}</span>
                    </div>
                    <div className="lead-detail-item">
                        <Clock size={13} />
                        <span>{getTimeAgo(lead.createdAt)}</span>
                    </div>
                    {lead.location && (
                        <div className="lead-detail-item">
                            <span className="lead-location">📍 {lead.location}</span>
                        </div>
                    )}
                </div>

                <div className="lead-actions">
                    <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'], lead.assignedAgentId)}
                        className="status-select"
                        style={{ borderColor: STAGE_COLORS[lead.status] }}
                    >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <button className="btn-icon" title="Schedule Visit" onClick={() => setShowVisitForm(true)}>
                        <Calendar size={15} />
                    </button>

                    <button className="btn-icon" title="View Details" onClick={() => setShowDetail(true)}>
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>

            {showVisitForm && (
                <VisitSchedulingForm
                    leadId={lead.id}
                    leadName={lead.name}
                    agentId={lead.assignedAgentId}
                    onClose={() => setShowVisitForm(false)}
                />
            )}

            {showDetail && (
                <LeadDetailModal
                    lead={lead}
                    agents={agents}
                    onClose={() => setShowDetail(false)}
                />
            )}
        </>
    );
};

export default LeadCard;
