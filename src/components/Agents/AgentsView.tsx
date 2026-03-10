import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Users, UserCheck, Calendar, Target, Phone, Mail } from 'lucide-react';

const AgentsView: React.FC = () => {
    const { agents, leads, visits } = useCRM();

    const getAgentStats = (agentId: string) => {
        const agentLeads = leads.filter(l => l.assignedAgentId === agentId);
        return {
            total: agentLeads.length,
            active: agentLeads.filter(l => !['Booked', 'Lost'].includes(l.status)).length,
            booked: agentLeads.filter(l => l.status === 'Booked').length,
            lost: agentLeads.filter(l => l.status === 'Lost').length,
            visits: visits.filter(v => v.agentId === agentId).length,
            convRate: agentLeads.length > 0
                ? ((agentLeads.filter(l => l.status === 'Booked').length / agentLeads.length) * 100).toFixed(0)
                : 0
        };
    };

    const sortedAgents = [...agents].sort((a, b) => {
        const sa = getAgentStats(a.id);
        const sb = getAgentStats(b.id);
        return sb.booked - sa.booked;
    });

    const STAGE_BAR_COLORS = ['#6366f1', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#10b981', '#ef4444'];
    const stages = ['New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested', 'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'];

    return (
        <div className="agents-page">
            <div className="agents-overview">
                <div className="overview-stat">
                    <Users size={20} />
                    <span>{agents.length} Agents</span>
                </div>
                <div className="overview-stat">
                    <UserCheck size={20} />
                    <span>{leads.filter(l => !['Booked', 'Lost'].includes(l.status)).length} Active Leads</span>
                </div>
                <div className="overview-stat">
                    <Target size={20} />
                    <span>{leads.filter(l => l.status === 'Booked').length} Total Bookings</span>
                </div>
            </div>

            <div className="agents-grid">
                {sortedAgents.map((agent, idx) => {
                    const stats = getAgentStats(agent.id);
                    const agentLeads = leads.filter(l => l.assignedAgentId === agent.id);

                    return (
                        <div key={agent.id} className={`agent-card card ${idx === 0 ? 'top-performer' : ''}`}>
                            {idx === 0 && <div className="top-badge">⭐ Top Performer</div>}

                            <div className="agent-card-header">
                                <div className="agent-avatar-lg">{agent.avatar}</div>
                                <div className="agent-card-info">
                                    <h3>{agent.name}</h3>
                                    <div className="agent-contact-row">
                                        <span><Mail size={12} /> {agent.email}</span>
                                    </div>
                                    <div className="agent-contact-row">
                                        <span><Phone size={12} /> {agent.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="agent-stat-row">
                                <div className="agent-stat-box">
                                    <span className="stat-num">{stats.total}</span>
                                    <span className="stat-lbl">Total</span>
                                </div>
                                <div className="agent-stat-box active">
                                    <span className="stat-num">{stats.active}</span>
                                    <span className="stat-lbl">Active</span>
                                </div>
                                <div className="agent-stat-box booked">
                                    <span className="stat-num">{stats.booked}</span>
                                    <span className="stat-lbl">Booked</span>
                                </div>
                                <div className="agent-stat-box visits">
                                    <span className="stat-num">{stats.visits}</span>
                                    <span className="stat-lbl">Visits</span>
                                </div>
                            </div>

                            <div className="agent-conv-rate">
                                <div className="conv-bar-track">
                                    <div className="conv-bar-fill" style={{ width: `${stats.convRate}%` }} />
                                </div>
                                <span>{stats.convRate}% conversion</span>
                            </div>

                            {/* Stage breakdown mini-chart */}
                            <div className="agent-stage-mini">
                                {stages.map((stage, si) => {
                                    const count = agentLeads.filter(l => l.status === stage).length;
                                    if (count === 0) return null;
                                    return (
                                        <div key={stage} className="stage-mini-item" title={stage}>
                                            <div
                                                className="stage-mini-bar"
                                                style={{
                                                    height: `${Math.max((count / Math.max(stats.total, 1)) * 60, 4)}px`,
                                                    backgroundColor: STAGE_BAR_COLORS[si]
                                                }}
                                            />
                                            <span>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="agent-recent-leads">
                                <p className="agent-section-title">Recent Leads</p>
                                {agentLeads.slice(0, 3).map(l => (
                                    <div key={l.id} className="agent-lead-mini">
                                        <span className="alm-name">{l.name}</span>
                                        <span className="alm-stage">{l.status}</span>
                                    </div>
                                ))}
                                {agentLeads.length === 0 && <p className="no-data-sm">No leads assigned</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentsView;
