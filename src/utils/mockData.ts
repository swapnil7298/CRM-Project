import { Agent, Lead, Visit } from '../types';

export const mockAgents: Agent[] = [
    { id: 'a1', name: 'Rohan Sharma', email: 'rohan@gharpayy.com', phone: '+91 9876500001', avatar: 'RS', activeLeads: 0 },
    { id: 'a2', name: 'Priya Patel', email: 'priya@gharpayy.com', phone: '+91 9876500002', avatar: 'PP', activeLeads: 0 },
    { id: 'a3', name: 'Amit Kumar', email: 'amit@gharpayy.com', phone: '+91 9876500003', avatar: 'AK', activeLeads: 0 },
    { id: 'a4', name: 'Sneha Rao', email: 'sneha@gharpayy.com', phone: '+91 9876500004', avatar: 'SR', activeLeads: 0 },
];

const now = Date.now();
const hour = 3600000;

export const mockLeads: Lead[] = [
    {
        id: 'l1',
        name: 'Vikram Singh',
        phone: '+91 9876543210',
        email: 'vikram.singh@example.com',
        source: 'Website Form',
        budget: '₹10,000 - ₹15,000',
        location: 'Koramangala',
        moveInDate: '2026-04-01',
        occupancy: 'Single',
        createdAt: new Date(now - hour * 26).toISOString(),
        assignedAgentId: 'a1',
        status: 'New Lead',
        lastActivityAt: new Date(now - hour * 26).toISOString(),
        notes: 'Interested in single occupancy near tech park',
        activity: [
            { id: 'act1', type: 'created', description: 'Lead created from Website Form', timestamp: new Date(now - hour * 26).toISOString() }
        ]
    },
    {
        id: 'l2',
        name: 'Neha Gupta',
        phone: '+91 9123456780',
        email: 'neha.g@example.com',
        source: 'WhatsApp',
        budget: '₹8,000 - ₹12,000',
        location: 'HSR Layout',
        occupancy: 'Double Sharing',
        createdAt: new Date(now - hour * 5).toISOString(),
        assignedAgentId: 'a2',
        status: 'Contacted',
        lastActivityAt: new Date(now - hour * 2).toISOString(),
        notes: 'Wants to move in immediately',
        activity: [
            { id: 'act2', type: 'created', description: 'Lead created via WhatsApp', timestamp: new Date(now - hour * 5).toISOString() },
            { id: 'act3', type: 'status_change', description: 'Status changed to Contacted', timestamp: new Date(now - hour * 2).toISOString(), agentId: 'a2' }
        ]
    },
    {
        id: 'l3',
        name: 'Arjun Reddy',
        phone: '+91 9988776655',
        source: 'Lead Form',
        budget: '₹12,000 - ₹18,000',
        location: 'Indiranagar',
        occupancy: 'Single',
        createdAt: new Date(now - hour * 48).toISOString(),
        assignedAgentId: 'a3',
        status: 'Visit Scheduled',
        lastActivityAt: new Date(now - hour * 1).toISOString(),
        notes: 'AC room preferred',
        activity: [
            { id: 'act4', type: 'created', description: 'Lead created from Lead Form', timestamp: new Date(now - hour * 48).toISOString() },
            { id: 'act5', type: 'status_change', description: 'Status changed to Contacted', timestamp: new Date(now - hour * 40).toISOString(), agentId: 'a3' },
            { id: 'act6', type: 'status_change', description: 'Status changed to Requirement Collected', timestamp: new Date(now - hour * 30).toISOString(), agentId: 'a3' },
            { id: 'act7', type: 'visit_scheduled', description: 'Visit scheduled at Gharpayy PG - Koramangala', timestamp: new Date(now - hour * 1).toISOString(), agentId: 'a3' }
        ]
    },
    {
        id: 'l4',
        name: 'Pooja Mehta',
        phone: '+91 9765432109',
        email: 'pooja.m@example.com',
        source: 'Social Media',
        budget: '₹9,000 - ₹14,000',
        location: 'Whitefield',
        occupancy: 'Double Sharing',
        createdAt: new Date(now - hour * 72).toISOString(),
        assignedAgentId: 'a1',
        status: 'Booked',
        lastActivityAt: new Date(now - hour * 12).toISOString(),
        activity: [
            { id: 'act8', type: 'created', description: 'Lead created via Social Media', timestamp: new Date(now - hour * 72).toISOString() },
            { id: 'act9', type: 'status_change', description: 'Status changed to Booked', timestamp: new Date(now - hour * 12).toISOString(), agentId: 'a1' }
        ]
    },
    {
        id: 'l5',
        name: 'Rahul Verma',
        phone: '+91 9654321098',
        source: 'Phone Call',
        budget: '₹7,000 - ₹10,000',
        location: 'BTM Layout',
        occupancy: 'Triple Sharing',
        createdAt: new Date(now - hour * 10).toISOString(),
        assignedAgentId: 'a2',
        status: 'Requirement Collected',
        lastActivityAt: new Date(now - hour * 3).toISOString(),
        activity: [
            { id: 'act10', type: 'created', description: 'Lead created from Phone Call', timestamp: new Date(now - hour * 10).toISOString() },
            { id: 'act11', type: 'status_change', description: 'Requirements collected over phone', timestamp: new Date(now - hour * 3).toISOString(), agentId: 'a2' }
        ]
    },
    {
        id: 'l6',
        name: 'Kavya Nair',
        phone: '+91 9543210987',
        email: 'kavya.n@example.com',
        source: 'Calendly',
        budget: '₹15,000 - ₹20,000',
        location: 'JP Nagar',
        occupancy: 'Single',
        createdAt: new Date(now - hour * 3).toISOString(),
        assignedAgentId: 'a4',
        status: 'Property Suggested',
        lastActivityAt: new Date(now - hour * 1).toISOString(),
        notes: 'High budget, premium property required',
        activity: [
            { id: 'act12', type: 'created', description: 'Lead booked via Calendly', timestamp: new Date(now - hour * 3).toISOString() },
            { id: 'act13', type: 'status_change', description: 'Properties shortlisted and shared', timestamp: new Date(now - hour * 1).toISOString(), agentId: 'a4' }
        ]
    },
    {
        id: 'l7',
        name: 'Suresh Iyer',
        phone: '+91 9432109876',
        source: 'WhatsApp',
        budget: '₹6,000 - ₹9,000',
        location: 'Electronic City',
        occupancy: 'Triple Sharing',
        createdAt: new Date(now - hour * 6).toISOString(),
        assignedAgentId: 'a3',
        status: 'Contacted',
        lastActivityAt: new Date(now - hour * 4).toISOString(),
        activity: [
            { id: 'act14', type: 'created', description: 'Lead created via WhatsApp', timestamp: new Date(now - hour * 6).toISOString() },
            { id: 'act15', type: 'status_change', description: 'Initial contact made', timestamp: new Date(now - hour * 4).toISOString(), agentId: 'a3' }
        ]
    },
    {
        id: 'l8',
        name: 'Divya Krishnan',
        phone: '+91 9321098765',
        email: 'divya.k@example.com',
        source: 'Website Form',
        budget: '₹11,000 - ₹16,000',
        location: 'Marathahalli',
        occupancy: 'Single',
        createdAt: new Date(now - hour * 36).toISOString(),
        assignedAgentId: 'a4',
        status: 'Visit Completed',
        lastActivityAt: new Date(now - hour * 5).toISOString(),
        notes: 'Visit went well, following up for booking',
        activity: [
            { id: 'act16', type: 'created', description: 'Lead created from Website Form', timestamp: new Date(now - hour * 36).toISOString() },
            { id: 'act17', type: 'visit_completed', description: 'Visit completed at Gharpayy PG - Marathahalli. Positive feedback.', timestamp: new Date(now - hour * 5).toISOString(), agentId: 'a4' }
        ]
    },
    {
        id: 'l9',
        name: 'Manish Joshi',
        phone: '+91 9210987654',
        source: 'Phone Call',
        budget: '₹8,000 - ₹11,000',
        location: 'Bellandur',
        occupancy: 'Double Sharing',
        createdAt: new Date(now - hour * 100).toISOString(),
        assignedAgentId: 'a1',
        status: 'Lost',
        lastActivityAt: new Date(now - hour * 80).toISOString(),
        notes: 'Found alternative accommodation',
        activity: [
            { id: 'act18', type: 'created', description: 'Lead created from Phone Call', timestamp: new Date(now - hour * 100).toISOString() },
            { id: 'act19', type: 'status_change', description: 'Marked as Lost - found other accommodation', timestamp: new Date(now - hour * 80).toISOString(), agentId: 'a1' }
        ]
    },
    {
        id: 'l10',
        name: 'Anjali Singh',
        phone: '+91 9109876543',
        email: 'anjali.s@example.com',
        source: 'Lead Form',
        budget: '₹10,000 - ₹14,000',
        location: 'Koramangala',
        occupancy: 'Single',
        createdAt: new Date(now - hour * 2).toISOString(),
        assignedAgentId: 'a2',
        status: 'New Lead',
        lastActivityAt: new Date(now - hour * 2).toISOString(),
        activity: [
            { id: 'act20', type: 'created', description: 'Lead created from Tally Form', timestamp: new Date(now - hour * 2).toISOString() }
        ]
    },
    {
        id: 'l11',
        name: 'Krishna Murthy',
        phone: '+91 9876001122',
        source: 'Social Media',
        budget: '₹9,000 - ₹13,000',
        location: 'HSR Layout',
        occupancy: 'Double Sharing',
        createdAt: new Date(now - hour * 55).toISOString(),
        assignedAgentId: 'a3',
        status: 'Booked',
        lastActivityAt: new Date(now - hour * 10).toISOString(),
        activity: [
            { id: 'act21', type: 'created', description: 'Lead created via Instagram', timestamp: new Date(now - hour * 55).toISOString() },
            { id: 'act22', type: 'status_change', description: 'Booking confirmed!', timestamp: new Date(now - hour * 10).toISOString(), agentId: 'a3' }
        ]
    },
    {
        id: 'l12',
        name: 'Shalini Rao',
        phone: '+91 9876009900',
        email: 'shalini.r@example.com',
        source: 'WhatsApp',
        budget: '₹12,000 - ₹17,000',
        location: 'Indiranagar',
        occupancy: 'Single',
        createdAt: new Date(now - hour * 15).toISOString(),
        assignedAgentId: 'a4',
        status: 'Contacted',
        lastActivityAt: new Date(now - hour * 14).toISOString(),
        activity: [
            { id: 'act23', type: 'created', description: 'Lead created via WhatsApp group', timestamp: new Date(now - hour * 15).toISOString() },
            { id: 'act24', type: 'status_change', description: 'Initial message sent via WhatsApp', timestamp: new Date(now - hour * 14).toISOString(), agentId: 'a4' }
        ]
    },
];

export const mockVisits: Visit[] = [
    {
        id: 'v1',
        leadId: 'l3',
        leadName: 'Arjun Reddy',
        propertyName: 'Gharpayy PG - Koramangala',
        date: new Date(now + hour * 24).toISOString().split('T')[0],
        time: '10:00',
        outcome: 'Pending',
        agentId: 'a3'
    },
    {
        id: 'v2',
        leadId: 'l8',
        leadName: 'Divya Krishnan',
        propertyName: 'Gharpayy PG - Marathahalli',
        date: new Date(now - hour * 5).toISOString().split('T')[0],
        time: '14:00',
        outcome: 'Completed',
        notes: 'Liked the room, waiting for decision',
        agentId: 'a4'
    },
    {
        id: 'v3',
        leadId: 'l11',
        leadName: 'Krishna Murthy',
        propertyName: 'Gharpayy PG - HSR Layout',
        date: new Date(now - hour * 10).toISOString().split('T')[0],
        time: '11:30',
        outcome: 'Completed',
        notes: 'Booking confirmed after visit',
        agentId: 'a3'
    },
    {
        id: 'v4',
        leadId: 'l6',
        leadName: 'Kavya Nair',
        propertyName: 'Gharpayy PG - JP Nagar',
        date: new Date(now + hour * 48).toISOString().split('T')[0],
        time: '10:00',
        outcome: 'Pending',
        agentId: 'a4'
    },
    {
        id: 'v5',
        leadId: 'l4',
        leadName: 'Pooja Mehta',
        propertyName: 'Gharpayy PG - Whitefield',
        date: new Date(now - hour * 12).toISOString().split('T')[0],
        time: '16:00',
        outcome: 'Completed',
        notes: 'Booking done',
        agentId: 'a1'
    }
];
