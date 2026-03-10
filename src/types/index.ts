export type LeadSource = 'WhatsApp' | 'Website Form' | 'Social Media' | 'Phone Call' | 'Lead Form' | 'Calendly';

export type LeadStatus =
    | 'New Lead'
    | 'Contacted'
    | 'Requirement Collected'
    | 'Property Suggested'
    | 'Visit Scheduled'
    | 'Visit Completed'
    | 'Booked'
    | 'Lost';

export interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string; // initials
    activeLeads: number;
}

export interface ActivityLog {
    id: string;
    type: 'status_change' | 'note_added' | 'visit_scheduled' | 'visit_completed' | 'assigned' | 'created';
    description: string;
    timestamp: string;
    agentId?: string;
}

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string;
    source: LeadSource;
    budget?: string;
    location?: string;
    moveInDate?: string;
    occupancy?: string;
    createdAt: string;
    assignedAgentId: string;
    status: LeadStatus;
    lastActivityAt: string;
    notes?: string;
    activity: ActivityLog[];
}

export type VisitOutcome = 'Pending' | 'Completed' | 'No Show' | 'Rescheduled';

export interface Visit {
    id: string;
    leadId: string;
    leadName: string;
    propertyName: string;
    date: string;
    time: string;
    outcome: VisitOutcome;
    notes?: string;
    agentId: string;
}
