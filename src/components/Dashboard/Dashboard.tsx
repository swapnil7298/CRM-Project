import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Users, Calendar, CheckCircle, AlertTriangle, Clock, Phone, Globe } from 'lucide-react';

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

const SOURCE_ICONS: Record<string, React.ReactNode> = {
    'WhatsApp': <span style={{ color: '#25D366', fontWeight: 700 }}>WA</span>,
    'Website Form': <Globe size={14} />,
    'Social Media': <span style={{ color: '#E1306C', fontWeight: 700 }}>SM</span>,
    'Phone Call': <Phone size={14} />,
    'Lead Form': <span style={{ color: '#6366f1', fontWeight: 700 }}>TF</span>,
    'Calendly': <Calendar size={14} />,
};

const Dashboard: React.FC = () => {
    const { leads, visits, agents, getInactiveLeads } = useCRM();
    const inactiveLeads = getInactiveLeads();
    const totalLeads = leads.length;

    const metrics = [
        {
            label: 'Total Leads',
            value: totalLeads,
            icon: <Users size={22} />,
            color: '#6366f1',
            sub: `+${leads.filter(l => (Date.now() - new Date(l.createdAt).getTime()) < 24 * 3600000).length} today`
        },
        {
            label: 'Visits Scheduled',
            value: visits.filter(v => v.outcome === 'Pending').length,
            icon: <Calendar size={22} />,
            color: '#0ea5e9',
            sub: `${visits.filter(v => v.outcome === 'Completed').length} completed`
        },
        {
            label: 'Conversions',
            value: leads.filter(l => l.status === 'Booked').length,
            icon: <CheckCircle size={22} />,
            color: '#10b981',
            sub: totalLeads ? `${((leads.filter(l => l.status === 'Booked').length / totalLeads) * 100).toFixed(1)}% rate` : '0% rate'
        },
        {
            label: 'Follow-up Needed',
            value: inactiveLeads.length,
            icon: <AlertTriangle size={22} />,
            color: '#f59e0b',
            sub: 'Inactive > 24 hrs'
        },
    ];

    const stageBreakdown = [
        'New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested',
        'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'
    ].map(stage => ({
        stage,
        count: leads.filter(l => l.status === stage).length,
        color: STAGE_COLORS[stage] || '#6366f1'
    }));

    // Source breakdown
    const sourceCounts = leads.reduce((acc, l) => {
        acc[l.source] = (acc[l.source] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Agent performance
    const agentPerformance = agents.map(agent => ({
        agent,
        total: leads.filter(l => l.assignedAgentId === agent.id).length,
        active: leads.filter(l => l.assignedAgentId === agent.id && !['Booked', 'Lost'].includes(l.status)).length,
        booked: leads.filter(l => l.assignedAgentId === agent.id && l.status === 'Booked').length,
        visits: visits.filter(v => v.agentId === agent.id).length,
    })).sort((a, b) => b.booked - a.booked);

    // Recent activity
    const recentLeads = [...leads]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const getTimeAgo = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor(diff / 60000);
        if (h >= 24) return `${Math.floor(h / 24)}d ago`;
        if (h >= 1) return `${h}h ago`;
        return `${m}m ago`;
    };

    const maxStageCount = Math.max(...stageBreakdown.map(s => s.count), 1);

    return (
        <div className="dashboard-container">
            {/* KPI Metrics */}
            <div className="metrics-grid">
                {metrics.map((m, i) => (
                    <div key={i} className="card metric-card">
                        <div className="metric-icon" style={{ backgroundColor: `${m.color}18`, color: m.color }}>
                            {m.icon}
                        </div>
                        <div className="metric-content">
                            <span className="metric-label">{m.label}</span>
                            <span className="metric-value">{m.value}</span>
                            <span className="metric-sub">{m.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-row">
                {/* Pipeline Funnel */}
                <div className="card">
                    <h3>Pipeline Funnel</h3>
                    <div className="status-bars">
                        {stageBreakdown.map((item) => (
                            <div key={item.stage} className="status-bar-item">
                                <div className="status-header">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                                        {item.stage}
                                    </span>
                                    <span className="stage-count-badge" style={{ background: item.color }}>{item.count}</span>
                                </div>
                                <div className="status-bar-bg">
                                    <div
                                        className="status-bar-fill"
                                        style={{ width: `${(item.count / maxStageCount) * 100}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agent Leaderboard */}
                <div className="card">
                    <h3>🏆 Agent Leaderboard</h3>
                    <div className="agent-leaderboard">
                        {agentPerformance.map((row, i) => (
                            <div key={row.agent.id} className={`leaderboard-row ${i === 0 ? 'top-agent' : ''}`}>
                                <div className="rank-badge">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                                <div className="agent-avatar-sm">{row.agent.avatar}</div>
                                <div className="agent-info-compact">
                                    <strong>{row.agent.name}</strong>
                                    <span>{row.active} active · {row.booked} booked</span>
                                </div>
                                <div className="agent-stats-compact">
                                    <div className="stat-pill green">{row.booked} 🎯</div>
                                    <div className="stat-pill blue">{row.visits} 👁</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="dashboard-row">
                {/* Lead Source Breakdown */}
                <div className="card">
                    <h3>Lead Sources</h3>
                    <div className="source-grid">
                        {Object.entries(sourceCounts).map(([source, count]) => (
                            <div key={source} className="source-card">
                                <div className="source-icon">{SOURCE_ICONS[source] || <Globe size={14} />}</div>
                                <div className="source-info">
                                    <span className="source-name">{source}</span>
                                    <span className="source-count">{count}</span>
                                </div>
                                <div className="source-bar-wrap">
                                    <div className="source-bar" style={{ width: `${(count / totalLeads) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="card">
                    <h3><Clock size={16} style={{ display: 'inline', marginRight: 6 }} />Recent Leads</h3>
                    <div className="recent-leads-list">
                        {recentLeads.map(lead => {
                            const agent = agents.find(a => a.id === lead.assignedAgentId);
                            return (
                                <div key={lead.id} className="recent-lead-item">
                                    <div className="recent-lead-avatar">{lead.name.charAt(0)}</div>
                                    <div className="recent-lead-info">
                                        <strong>{lead.name}</strong>
                                        <span>{lead.source} · {agent?.name || 'Unassigned'}</span>
                                    </div>
                                    <div className="recent-lead-right">
                                        <div className="stage-chip" style={{ background: STAGE_COLORS[lead.status] + '22', color: STAGE_COLORS[lead.status] }}>
                                            {lead.status}
                                        </div>
                                        <span className="time-ago">{getTimeAgo(lead.createdAt)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Follow-up Alert */}
            {inactiveLeads.length > 0 && (
                <div className="card followup-alert">
                    <div className="followup-header">
                        <AlertTriangle size={18} />
                        <h3>{inactiveLeads.length} Lead{inactiveLeads.length > 1 ? 's' : ''} Need Follow-up</h3>
                    </div>
                    <div className="followup-list">
                        {inactiveLeads.slice(0, 5).map(lead => {
                            const agent = agents.find(a => a.id === lead.assignedAgentId);
                            const hoursInactive = Math.floor((Date.now() - new Date(lead.lastActivityAt).getTime()) / 3600000);
                            return (
                                <div key={lead.id} className="followup-item">
                                    <span className="followup-name">{lead.name}</span>
                                    <span className="followup-agent">{agent?.name}</span>
                                    <span className="followup-stage">{lead.status}</span>
                                    <span className="followup-time">{hoursInactive}h inactive</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
