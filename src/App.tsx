import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import Dashboard from './components/Dashboard/Dashboard';
import KanbanBoard from './components/Pipeline/KanbanBoard';
import LeadCaptureForm from './components/Forms/LeadCaptureForm';
import VisitsManager from './components/Visits/VisitsManager';
import AgentsView from './components/Agents/AgentsView';
import RemindersView from './components/Reminders/RemindersView';
import { LayoutDashboard, BarChart3, FormInput, Building2, Calendar, Users, Bell } from 'lucide-react';

type Tab = 'dashboard' | 'pipeline' | 'capture' | 'visits' | 'agents' | 'reminders';

const PAGE_TITLES: Record<Tab, string> = {
    dashboard: 'Business Overview',
    pipeline: 'Sales Pipeline',
    capture: 'Capture Lead',
    visits: 'Visit Management',
    agents: 'Agent Management',
    reminders: 'Follow-up Reminders',
};

function AppInner() {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const { leads, getInactiveLeads } = useCRM();
    const inactiveCount = getInactiveLeads().length;
    const newLeadsCount = leads.filter(l => l.status === 'New Lead').length;

    const navItems = [
        { id: 'dashboard' as Tab, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'pipeline' as Tab, label: 'Pipeline', icon: <BarChart3 size={18} />, badge: newLeadsCount > 0 ? newLeadsCount : undefined },
        { id: 'visits' as Tab, label: 'Visits', icon: <Calendar size={18} /> },
        { id: 'agents' as Tab, label: 'Agents', icon: <Users size={18} /> },
        { id: 'reminders' as Tab, label: 'Reminders', icon: <Bell size={18} />, badge: inactiveCount > 0 ? inactiveCount : undefined, badgeColor: '#ef4444' },
        { id: 'capture' as Tab, label: 'Add Lead', icon: <FormInput size={18} /> },
    ];

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Building2 className="logo-icon" size={28} />
                    <div>
                        <h2>Gharpayy <span>CRM</span></h2>
                        <span className="sidebar-tagline">Lead Management</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge !== undefined && (
                                <span
                                    className="nav-badge"
                                    style={{ background: item.badgeColor || '#6366f1' }}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-divider" />
                    <div className="user-profile">
                        <div className="avatar">AD</div>
                        <div className="user-info">
                            <strong>Admin</strong>
                            <span>gharpayy@gmail.com</span>
                        </div>
                    </div>
                    <div className="sidebar-version">MVP v1.0</div>
                </div>
            </aside>

            <main className="main-content">
                <header className="page-header">
                    <div className="page-header-left">
                        <h1>{PAGE_TITLES[activeTab]}</h1>
                    </div>
                    <div className="header-actions">
                        <div className="live-indicator">
                            <span className="live-dot" />
                            Live
                        </div>
                        <button
                            className="header-add-btn"
                            onClick={() => setActiveTab('capture')}
                        >
                            <FormInput size={15} /> New Lead
                        </button>
                    </div>
                </header>

                <div className="content-area">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'pipeline' && <KanbanBoard />}
                    {activeTab === 'visits' && <VisitsManager />}
                    {activeTab === 'agents' && <AgentsView />}
                    {activeTab === 'reminders' && <RemindersView />}
                    {activeTab === 'capture' && <LeadCaptureForm />}
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <CRMProvider>
            <AppInner />
        </CRMProvider>
    );
}

export default App;
