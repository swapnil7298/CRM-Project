import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { AlertTriangle, Clock, User, ArrowRight, Bell } from 'lucide-react';

const RemindersView: React.FC = () => {
    const { leads, agents, updateLeadStatus } = useCRM();

    const inactiveLeads = leads.filter(l =>
        !['Booked', 'Lost'].includes(l.status) &&
        (Date.now() - new Date(l.lastActivityAt).getTime()) > 24 * 3600000
    ).sort((a, b) => new Date(a.lastActivityAt).getTime() - new Date(b.lastActivityAt).getTime());

    const getHoursInactive = (iso: string) =>
        Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);

    const getDaysInactive = (iso: string) =>
        Math.floor((Date.now() - new Date(iso).getTime()) / (3600000 * 24));

    const getUrgencyLevel = (hours: number): 'critical' | 'high' | 'medium' => {
        if (hours >= 72) return 'critical';
        if (hours >= 48) return 'high';
        return 'medium';
    };

    const urgencyConfig = {
        critical: { label: 'CRITICAL', color: '#ef4444', bg: '#fef2f2' },
        high: { label: 'HIGH', color: '#f97316', bg: '#fff7ed' },
        medium: { label: 'MEDIUM', color: '#f59e0b', bg: '#fffbeb' },
    };

    if (inactiveLeads.length === 0) {
        return (
            <div className="reminders-page">
                <div className="reminders-all-clear">
                    <Bell size={48} style={{ color: '#10b981' }} />
                    <h3>All Clear! 🎉</h3>
                    <p>No leads requiring follow-up. Great job staying on top of things!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reminders-page">
            <div className="reminders-header">
                <div className="reminders-title">
                    <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                    <h2>{inactiveLeads.length} Follow-up Reminder{inactiveLeads.length > 1 ? 's' : ''}</h2>
                </div>
                <p className="reminders-subtitle">
                    These leads have had no activity for more than 24 hours. Reach out now to keep the pipeline moving.
                </p>
            </div>

            <div className="reminders-summary-row">
                <div className="rscard critical">
                    <span>{inactiveLeads.filter(l => getHoursInactive(l.lastActivityAt) >= 72).length}</span>
                    <label>Critical (&gt;72h)</label>
                </div>
                <div className="rscard high">
                    <span>{inactiveLeads.filter(l => getHoursInactive(l.lastActivityAt) >= 48 && getHoursInactive(l.lastActivityAt) < 72).length}</span>
                    <label>High (48-72h)</label>
                </div>
                <div className="rscard medium">
                    <span>{inactiveLeads.filter(l => getHoursInactive(l.lastActivityAt) >= 24 && getHoursInactive(l.lastActivityAt) < 48).length}</span>
                    <label>Medium (24-48h)</label>
                </div>
            </div>

            <div className="reminders-list">
                {inactiveLeads.map(lead => {
                    const agent = agents.find(a => a.id === lead.assignedAgentId);
                    const hours = getHoursInactive(lead.lastActivityAt);
                    const days = getDaysInactive(lead.lastActivityAt);
                    const urgency = getUrgencyLevel(hours);
                    const cfg = urgencyConfig[urgency];

                    return (
                        <div key={lead.id} className="reminder-card card" style={{ borderLeft: `4px solid ${cfg.color}` }}>
                            <div className="reminder-urgency" style={{ background: cfg.bg, color: cfg.color }}>
                                <AlertTriangle size={12} /> {cfg.label}
                            </div>

                            <div className="reminder-main">
                                <div className="reminder-lead-info">
                                    <div className="reminder-avatar" style={{ background: cfg.color }}>{lead.name.charAt(0)}</div>
                                    <div>
                                        <strong>{lead.name}</strong>
                                        <span>{lead.phone}</span>
                                    </div>
                                </div>

                                <div className="reminder-meta">
                                    <span><User size={13} /> {agent?.name || 'Unassigned'}</span>
                                    <span><Clock size={13} /> {days > 0 ? `${days}d` : `${hours}h`} inactive</span>
                                    <span><ArrowRight size={13} /> {lead.status}</span>
                                </div>

                                {lead.notes && <div className="reminder-note">📝 {lead.notes}</div>}
                            </div>

                            <div className="reminder-actions">
                                <select
                                    value={lead.status}
                                    onChange={e => updateLeadStatus(lead.id, e.target.value as any, lead.assignedAgentId)}
                                    className="status-select"
                                >
                                    {['New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested', 'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <button
                                    className="btn-mark-contacted"
                                    onClick={() => updateLeadStatus(lead.id, 'Contacted', lead.assignedAgentId)}
                                >
                                    Mark Contacted
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RemindersView;
