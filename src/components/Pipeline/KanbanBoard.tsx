import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { LeadStatus } from '../../types';
import LeadCard from './LeadCard';

const KanbanBoard: React.FC = () => {
    const { getLeadsByStatus, agents } = useCRM();

    const stages: LeadStatus[] = [
        'New Lead',
        'Contacted',
        'Requirement Collected',
        'Property Suggested',
        'Visit Scheduled',
        'Visit Completed',
        'Booked',
        'Lost'
    ];

    return (
        <div className="pipeline-container">
            <div className="kanban-board">
                {stages.map(stage => {
                    const leads = getLeadsByStatus(stage);
                    return (
                        <div key={stage} className="kanban-column">
                            <div className="column-header">
                                <h3>{stage}</h3>
                                <span className="count-badge">{leads.length}</span>
                            </div>
                            <div className="column-leads">
                                {leads.map(lead => (
                                    <LeadCard key={lead.id} lead={lead} agents={agents} />
                                ))}
                                {leads.length === 0 && <div className="empty-state">No leads</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanBoard;
