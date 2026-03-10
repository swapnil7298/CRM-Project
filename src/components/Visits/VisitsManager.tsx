import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Calendar, Check, X, RefreshCw, Trash2 } from 'lucide-react';

const VisitsManager: React.FC = () => {
    const { visits, agents, leads, updateVisitOutcome, deleteVisit } = useCRM();
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'No Show'>('All');
    const [outcomeNotes, setOutcomeNotes] = useState<Record<string, string>>({});

    const filtered = visits.filter(v => filter === 'All' || v.outcome === filter)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const isUpcoming = (date: string) => new Date(date) >= new Date(new Date().toDateString());

    const outcomeClass: Record<string, string> = {
        'Pending': 'outcome-pending',
        'Completed': 'outcome-completed',
        'No Show': 'outcome-noshow',
        'Rescheduled': 'outcome-rescheduled'
    };

    return (
        <div className="visits-page">
            <div className="visits-header">
                <div className="visits-stats">
                    <div className="vstat-card">
                        <span>{visits.filter(v => v.outcome === 'Pending').length}</span>
                        <label>Upcoming</label>
                    </div>
                    <div className="vstat-card green">
                        <span>{visits.filter(v => v.outcome === 'Completed').length}</span>
                        <label>Completed</label>
                    </div>
                    <div className="vstat-card red">
                        <span>{visits.filter(v => v.outcome === 'No Show').length}</span>
                        <label>No Show</label>
                    </div>
                </div>
                <div className="filter-tabs">
                    {(['All', 'Pending', 'Completed', 'No Show'] as const).map(f => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="visits-list">
                {filtered.length === 0 && (
                    <div className="empty-visits">
                        <Calendar size={40} />
                        <p>No visits found</p>
                    </div>
                )}
                {filtered.map(visit => {
                    const agent = agents.find(a => a.id === visit.agentId);
                    const lead = leads.find(l => l.id === visit.leadId);
                    const upcoming = isUpcoming(visit.date);

                    return (
                        <div key={visit.id} className={`visit-row card ${upcoming && visit.outcome === 'Pending' ? 'visit-upcoming' : ''}`}>
                            <div className="visit-row-main">
                                <div className="visit-row-date">
                                    <span className="visit-day">{new Date(visit.date).getDate()}</span>
                                    <span className="visit-month">{new Date(visit.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="visit-time-label">{visit.time}</span>
                                </div>
                                <div className="visit-row-info">
                                    <div className="visit-lead-name">{visit.leadName}</div>
                                    <div className="visit-property">📍 {visit.propertyName}</div>
                                    {agent && <div className="visit-agent">👤 {agent.name}</div>}
                                    {visit.notes && <div className="visit-notes-preview">💬 {visit.notes}</div>}
                                </div>
                                <div className="visit-row-status">
                                    <span className={`outcome-badge ${outcomeClass[visit.outcome] || ''}`}>{visit.outcome}</span>
                                </div>
                            </div>

                            {visit.outcome === 'Pending' && (
                                <div className="visit-row-actions">
                                    <input
                                        className="visit-notes-input"
                                        placeholder="Add outcome notes..."
                                        value={outcomeNotes[visit.id] || ''}
                                        onChange={e => setOutcomeNotes(prev => ({ ...prev, [visit.id]: e.target.value }))}
                                    />
                                    <div className="outcome-btns">
                                        <button
                                            className="outcome-btn green"
                                            onClick={() => updateVisitOutcome(visit.id, 'Completed', outcomeNotes[visit.id])}
                                        >
                                            <Check size={14} /> Completed
                                        </button>
                                        <button
                                            className="outcome-btn red"
                                            onClick={() => updateVisitOutcome(visit.id, 'No Show', outcomeNotes[visit.id])}
                                        >
                                            <X size={14} /> No Show
                                        </button>
                                        <button
                                            className="outcome-btn yellow"
                                            onClick={() => updateVisitOutcome(visit.id, 'Rescheduled', outcomeNotes[visit.id])}
                                        >
                                            <RefreshCw size={14} /> Reschedule
                                        </button>
                                        <button
                                            className="outcome-btn gray"
                                            onClick={() => deleteVisit(visit.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisitsManager;
