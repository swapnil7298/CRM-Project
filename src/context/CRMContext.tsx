import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, Agent, Visit, LeadStatus, ActivityLog } from '../types';
import { mockAgents, mockLeads, mockVisits } from '../utils/mockData';

interface CRMContextType {
    leads: Lead[];
    agents: Agent[];
    visits: Visit[];
    addLead: (lead: Omit<Lead, 'id' | 'assignedAgentId' | 'status' | 'lastActivityAt' | 'createdAt' | 'activity'>) => void;
    updateLeadStatus: (leadId: string, newStatus: LeadStatus, agentId?: string) => void;
    reassignLead: (leadId: string, newAgentId: string) => void;
    addNote: (leadId: string, note: string) => void;
    addVisit: (visit: Omit<Visit, 'id'>) => void;
    updateVisitOutcome: (visitId: string, outcome: Visit['outcome'], notes?: string) => void;
    getLeadsByStatus: (status: LeadStatus) => Lead[];
    getAgentLeadCount: (agentId: string) => number;
    getAgentConversions: (agentId: string) => number;
    getInactiveLeads: () => Lead[];
    deleteVisit: (visitId: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const getStoredData = <T,>(key: string, fallback: T): T => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
};

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [leads, setLeads] = useState<Lead[]>(() => getStoredData('gharpayy_leads_v2', mockLeads));
    const [agents, setAgents] = useState<Agent[]>(() => getStoredData('gharpayy_agents_v2', mockAgents));
    const [visits, setVisits] = useState<Visit[]>(() => getStoredData('gharpayy_visits_v2', mockVisits));
    const [lastAssignedIndex, setLastAssignedIndex] = useState(0);

    useEffect(() => { localStorage.setItem('gharpayy_leads_v2', JSON.stringify(leads)); }, [leads]);
    useEffect(() => { localStorage.setItem('gharpayy_agents_v2', JSON.stringify(agents)); }, [agents]);
    useEffect(() => { localStorage.setItem('gharpayy_visits_v2', JSON.stringify(visits)); }, [visits]);

    // Keep agent activeLeads count in sync
    useEffect(() => {
        setAgents(prev => prev.map(agent => ({
            ...agent,
            activeLeads: leads.filter(l => l.assignedAgentId === agent.id && !['Booked', 'Lost'].includes(l.status)).length
        })));
    }, [leads]);

    const addActivity = (leadId: string, log: Omit<ActivityLog, 'id'>): void => {
        setLeads(prev => prev.map(l => l.id === leadId ? {
            ...l,
            activity: [...(l.activity || []), { ...log, id: `act_${Date.now()}_${Math.random()}` }],
            lastActivityAt: new Date().toISOString()
        } : l));
    };

    const addLead = (leadData: Omit<Lead, 'id' | 'assignedAgentId' | 'status' | 'lastActivityAt' | 'createdAt' | 'activity'>) => {
        // Workload-based assignment: assign to agent with fewest active leads
        const sortedAgents = [...agents].sort((a, b) => a.activeLeads - b.activeLeads);
        const assignedAgent = sortedAgents[0];

        const newLead: Lead = {
            ...leadData,
            id: `l${Date.now()}`,
            assignedAgentId: assignedAgent.id,
            status: 'New Lead',
            createdAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString(),
            activity: [
                { id: `act_${Date.now()}`, type: 'created', description: `Lead captured from ${leadData.source}`, timestamp: new Date().toISOString() }
            ]
        };
        setLeads(prev => [newLead, ...prev]);
    };

    const updateLeadStatus = (leadId: string, newStatus: LeadStatus, agentId?: string) => {
        setLeads(prev => prev.map(lead => {
            if (lead.id !== leadId) return lead;
            const log: ActivityLog = {
                id: `act_${Date.now()}`,
                type: 'status_change',
                description: `Status changed to "${newStatus}"`,
                timestamp: new Date().toISOString(),
                agentId
            };
            return {
                ...lead,
                status: newStatus,
                lastActivityAt: new Date().toISOString(),
                activity: [...(lead.activity || []), log]
            };
        }));
    };

    const reassignLead = (leadId: string, newAgentId: string) => {
        setLeads(prev => prev.map(lead => {
            if (lead.id !== leadId) return lead;
            const newAgent = agents.find(a => a.id === newAgentId);
            const log: ActivityLog = {
                id: `act_${Date.now()}`,
                type: 'assigned',
                description: `Lead reassigned to ${newAgent?.name || 'Unknown'}`,
                timestamp: new Date().toISOString()
            };
            return {
                ...lead,
                assignedAgentId: newAgentId,
                lastActivityAt: new Date().toISOString(),
                activity: [...(lead.activity || []), log]
            };
        }));
    };

    const addNote = (leadId: string, note: string) => {
        setLeads(prev => prev.map(lead => {
            if (lead.id !== leadId) return lead;
            const log: ActivityLog = {
                id: `act_${Date.now()}`,
                type: 'note_added',
                description: note,
                timestamp: new Date().toISOString()
            };
            return {
                ...lead,
                notes: note,
                lastActivityAt: new Date().toISOString(),
                activity: [...(lead.activity || []), log]
            };
        }));
    };

    const addVisit = (visitData: Omit<Visit, 'id'>) => {
        const newVisit: Visit = { ...visitData, id: `v${Date.now()}` };
        setVisits(prev => [newVisit, ...prev]);
        setLeads(prev => prev.map(lead => {
            if (lead.id !== visitData.leadId) return lead;
            const log: ActivityLog = {
                id: `act_${Date.now()}`,
                type: 'visit_scheduled',
                description: `Visit scheduled at ${visitData.propertyName} on ${visitData.date} at ${visitData.time}`,
                timestamp: new Date().toISOString(),
                agentId: visitData.agentId
            };
            return {
                ...lead,
                lastActivityAt: new Date().toISOString(),
                activity: [...(lead.activity || []), log]
            };
        }));
    };

    const updateVisitOutcome = (visitId: string, outcome: Visit['outcome'], notes?: string) => {
        const visit = visits.find(v => v.id === visitId);
        setVisits(prev => prev.map(v => v.id === visitId ? { ...v, outcome, notes: notes ?? v.notes } : v));
        if (visit) {
            const log: ActivityLog = {
                id: `act_${Date.now()}`,
                type: 'visit_completed',
                description: `Visit outcome updated to "${outcome}"${notes ? `: ${notes}` : ''}`,
                timestamp: new Date().toISOString(),
                agentId: visit.agentId
            };
            setLeads(prev => prev.map(lead => lead.id === visit.leadId ? {
                ...lead,
                status: outcome === 'Completed' ? 'Visit Completed' : lead.status,
                lastActivityAt: new Date().toISOString(),
                activity: [...(lead.activity || []), log]
            } : lead));
        }
    };

    const deleteVisit = (visitId: string) => {
        setVisits(prev => prev.filter(v => v.id !== visitId));
    };

    const getLeadsByStatus = (status: LeadStatus) => leads.filter(l => l.status === status);

    const getAgentLeadCount = (agentId: string) =>
        leads.filter(l => l.assignedAgentId === agentId && !['Booked', 'Lost'].includes(l.status)).length;

    const getAgentConversions = (agentId: string) =>
        leads.filter(l => l.assignedAgentId === agentId && l.status === 'Booked').length;

    const getInactiveLeads = () =>
        leads.filter(l =>
            !['Booked', 'Lost'].includes(l.status) &&
            (Date.now() - new Date(l.lastActivityAt).getTime()) > 24 * 3600000
        );

    return (
        <CRMContext.Provider value={{
            leads, agents, visits,
            addLead, updateLeadStatus, reassignLead, addNote,
            addVisit, updateVisitOutcome, deleteVisit,
            getLeadsByStatus, getAgentLeadCount, getAgentConversions, getInactiveLeads
        }}>
            {children}
        </CRMContext.Provider>
    );
};

export const useCRM = () => {
    const context = useContext(CRMContext);
    if (!context) throw new Error('useCRM must be used within a CRMProvider');
    return context;
};
