import React, { useContext } from 'react'
import AppSidebar from '../components/AppSidebar'
import Sidebar from '../components/Sidebar'
import GroupsSidebar from '../components/GroupsSidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import CallHistory from '../components/CallHistory'
import SettingsPanel from '../components/SettingsPanel'
import AdminPanel from '../components/AdminPanel'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const chatContext = useContext(ChatContext);
  if (!chatContext) return null;

  const { selectedUser, activeTab } = chatContext;

  const renderActiveContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar (DM chat list) */}
            <div className={`w-full md:w-[320px] flex-shrink-0 ${selectedUser ? 'max-md:hidden' : ''}`}>
              <Sidebar />
            </div>

            {/* Chat Conversation Panel */}
            <div className={`flex-1 h-full bg-slate-950/20 border-r border-slate-800/80 ${!selectedUser ? 'max-md:hidden' : ''}`}>
              <ChatContainer />
            </div>

            {/* User Profile Info Panel */}
            {selectedUser && (
              <div className="hidden lg:block w-[280px] flex-shrink-0 bg-slate-950/40">
                <RightSidebar />
              </div>
            )}
          </div>
        );

      case "groups":
        return (
          <div className="flex-1 flex overflow-hidden">
            {/* Groups Sidebar (List of joined groups + join/create triggers) */}
            <div className={`w-full md:w-[320px] flex-shrink-0 ${selectedUser ? 'max-md:hidden' : ''}`}>
              <GroupsSidebar />
            </div>

            {/* Chat Conversation Panel */}
            <div className={`flex-1 h-full bg-slate-950/20 border-r border-slate-800/80 ${!selectedUser ? 'max-md:hidden' : ''}`}>
              <ChatContainer />
            </div>
          </div>
        );

      case "calls":
        return (
          <div className="flex-1 flex overflow-hidden">
            <CallHistory />
          </div>
        );

      case "settings":
        return (
          <div className="flex-1 flex overflow-hidden">
            <SettingsPanel />
          </div>
        );

      case "admin":
        return (
          <div className="flex-1 flex overflow-hidden">
            <AdminPanel />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='w-full h-screen bg-slate-950 flex items-center justify-center sm:p-4'>
      <div className='w-full h-full max-w-7xl bg-slate-900/10 border border-slate-800/80 rounded-2xl overflow-hidden flex shadow-2xl backdrop-blur-2xl'>
        <AppSidebar />
        <div className='flex-1 flex overflow-hidden bg-slate-900/30'>
          {renderActiveContent()}
        </div>
      </div>
    </div>
  )
}

// Small placeholder icons for early tabs
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={props.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M3 19.128a9.38 9.38 0 012.625.372 9.337 9.337 0 014.121-.952 4.125 4.125 0 01-7.533-2.493M3 19.128v-.003c0-1.113.285-2.16.786-3.07M3 19.128v.109A11.386 11.386 0 008.91 20M12 10.5a3 3 0 11-6 0 3 3 0 016 0zm7.5 0a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={props.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={props.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className={props.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

export default HomePage
