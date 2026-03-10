import React, { useState } from 'react';
import { Lead, Agent } from '../../types';
import { useCRM } from '../../context/CRMContext';
import {
    X, Phone, Mail, User, Clock, MapPin, Calendar, MessageSquare,
    DollarSign, Home, Edit3, Check
} from 'lucide-react';
import VisitSchedulingForm from '../Forms/VisitSchedulingForm';

interface LeadDetailModalProps {
    lead: Lead;
    agents: Agent[];
    onClose: () => void;
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

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
    'created': <span className="act-dot green" />,
    'status_change': <span className="act-dot blue" />,
    'note_added': <span className="act-dot purple" />,
    'visit_scheduled': <span className="act-dot pink" />,
    'visit_completed': <span className="act-dot teal" />,
    'assigned': <span className="act-dot orange" />,
};

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, agents, onClose }) => {
    const { updateLeadStatus, reassignLead, addNote, visits } = useCRM();
    const [noteText, setNoteText] = useState(lead.notes || '');
    const [editingNote, setEditingNote] = useState(false);
    const [showVisitForm, setShowVisitForm] = useState(false);
    const agentName = agents.find(a => a.id === lead.assignedAgentId)?.name || 'Unassigned';

    const statuses: Lead['status'][] = [
        'New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested',
        'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'
    ];

    const leadVisits = visits.filter(v => v.leadId === lead.id);

    const getTimeAgo = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor(diff / 60000);
        if (h >= 24) return `${Math.floor(h / 24)}d ago`;
        if (h >= 1) return `${h}h ago`;
        return `${m}m ago`;
    };

    const handleSaveNote = () => {
        addNote(lead.id, noteText);
        setEditingNote(false);
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="lead-detail-modal" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="ldm-header">
                        <div className="ldm-name-block">
                            <div className="ldm-avatar">{lead.name.charAt(0)}</div>
                            <div>
                                <h2>{lead.name}</h2>
                                <div className="ldm-source-badge">{lead.source}</div>
                            </div>
                        </div>
                        <div className="ldm-header-actions">
                            <select
                                value={lead.status}
                                onChange={e => updateLeadStatus(lead.id, e.target.value as Lead['status'], lead.assignedAgentId)}
                                className="status-select-large"
                                style={{ borderColor: STAGE_COLORS[lead.status] }}
                            >
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button className="ldm-close" onClick={onClose}><X size={18} /></button>
                        </div>
                    </div>

                    <div className="ldm-body">
                        {/* Left Column - Info */}
                        <div className="ldm-left">
                            {/* Contact Info */}
                            <div className="ldm-section">
                                <h4>Contact Information</h4>
                                <div className="ldm-info-grid">
                                    <div className="ldm-info-row">
                                        <Phone size={14} />
                                        <span>{lead.phone}</span>
                                    </div>
                                    {lead.email && (
                                        <div className="ldm-info-row">
                                            <Mail size={14} />
                                            <span>{lead.email}</span>
                                        </div>
                                    )}
                                    <div className="ldm-info-row">
                                        <Clock size={14} />
                                        <span>Added {getTimeAgo(lead.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="ldm-section">
                                <h4>Requirements</h4>
                                <div className="ldm-info-grid">
                                    {lead.location && (
                                        <div className="ldm-info-row">
                                            <MapPin size={14} />
                                            <span>{lead.location}</span>
                                        </div>
                                    )}
                                    {lead.budget && (
                                        <div className="ldm-info-row">
                                            <DollarSign size={14} />
                                            <span>{lead.budget}</span>
                                        </div>
                                    )}
                                    {lead.occupancy && (
                                        <div className="ldm-info-row">
                                            <Home size={14} />
                                            <span>{lead.occupancy}</span>
                                        </div>
                                    )}
                                    {lead.moveInDate && (
                                        <div className="ldm-info-row">
                                            <Calendar size={14} />
                                            <span>Move-in: {lead.moveInDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Assignment */}
                            <div className="ldm-section">
                                <h4>Assignment</h4>
                                <div className="ldm-info-row" style={{ marginBottom: '0.75rem' }}>
                                    <User size={14} />
                                    <span>{agentName}</span>
                                </div>
                                <select
                                    value={lead.assignedAgentId}
                                    onChange={e => reassignLead(lead.id, e.target.value)}
                                    className="reassign-select"
                                >
                                    {agents.map(a => (
                                        <option key={a.id} value={a.id}>{a.name} ({a.activeLeads} active)</option>
                                    ))}
                                </select>
                            </div>

                            {/* Notes */}
                            <div className="ldm-section">
                                <div className="ldm-section-header">
                                    <h4><MessageSquare size={14} style={{ display: 'inline', marginRight: 4 }} />Notes</h4>
                                    {!editingNote && (
                                        <button className="edit-note-btn" onClick={() => setEditingNote(true)}>
                                            <Edit3 size={13} /> Edit
                                        </button>
                                    )}
                                </div>
                                {editingNote ? (
                                    <div>
                                        <textarea
                                            className="note-textarea"
                                            value={noteText}
                                            onChange={e => setNoteText(e.target.value)}
                                            placeholder="Add notes about this lead..."
                                            rows={3}
                                        />
                                        <div className="note-actions">
                                            <button className="btn-save-note" onClick={handleSaveNote}><Check size={13} /> Save</button>
                                            <button className="btn-cancel-note" onClick={() => { setEditingNote(false); setNoteText(lead.notes || ''); }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="note-display">{lead.notes || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No notes yet. Click Edit to add.</span>}</p>
                                )}
                            </div>

                            {/* Scheduled Visits */}
                            {leadVisits.length > 0 && (
                                <div className="ldm-section">
                                    <h4><Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />Visits</h4>
                                    {leadVisits.map(v => (
                                        <div key={v.id} className="visit-mini-card">
                                            <div className="visit-mini-info">
                                                <strong>{v.propertyName}</strong>
                                                <span>{v.date} at {v.time}</span>
                                            </div>
                                            <span className={`visit-outcome-chip outcome-${v.outcome.toLowerCase().replace(' ', '-')}`}>{v.outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                className="btn-schedule-visit"
                                onClick={() => setShowVisitForm(true)}
                            >
                                <Calendar size={14} /> Schedule Visit
                            </button>
                        </div>

                        {/* Right Column - Activity Timeline */}
                        <div className="ldm-right">
                            <h4 className="timeline-title">Activity Timeline</h4>
                            <div className="activity-timeline">
                                {[...(lead.activity || [])].reverse().map((act, idx) => {
                                    const agent = agents.find(a => a.id === act.agentId);
                                    return (
                                        <div key={act.id} className="timeline-item">
                                            <div className="timeline-dot-wrap">
                                                {ACTIVITY_ICONS[act.type] || <span className="act-dot gray" />}
                                                {idx < (lead.activity || []).length - 1 && <div className="timeline-line" />}
                                            </div>
                                            <div className="timeline-content">
                                                <p>{act.description}</p>
                                                <div className="timeline-meta">
                                                    {agent && <span className="timeline-agent">{agent.name}</span>}
                                                    <span className="timeline-time">{getTimeAgo(act.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
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
        </>
    );
};

export default LeadDetailModal;
