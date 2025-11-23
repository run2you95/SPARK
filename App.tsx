
import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, User, LayoutGrid } from 'lucide-react';
import { AppTab, MatchCandidate, UserSettings, UserProfile } from './types';
import { Community } from './components/Community';
import { Matching } from './components/Matching';
import { Chat } from './components/Chat';
import { Profile } from './components/Profile';
import { CURRENT_USER, MOCK_CANDIDATES, MOCK_GROUPS, TRANSLATIONS } from './constants';

const MatchList = ({ onSelect, language }: { onSelect: (m: MatchCandidate) => void, language: 'vi'|'en' }) => {
  const t = TRANSLATIONS[language];
  return (
    <div className="p-4 bg-white dark:bg-slate-900 h-full overflow-y-auto pb-24 text-slate-900 dark:text-white">
      <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-500 mb-6">{t.tab_chat}</h2>
      
      {/* Direct Messages Section */}
      <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Direct Messages</h3>
          <div className="space-y-2">
          {MOCK_CANDIDATES.map(match => (
              <div 
              key={match.id} 
              onClick={() => onSelect(match)}
              className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition border border-transparent hover:border-pink-500/30"
              >
              <div className="relative">
                  <img src={match.photos[0]} alt={match.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{match.name}</h3>
                      <span className="text-[10px] text-slate-500">2m ago</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs truncate">...</p>
              </div>
              </div>
          ))}
          </div>
      </div>

      {/* Groups Section */}
      <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t.tab_groups}</h3>
          <div className="space-y-2">
          {MOCK_GROUPS.map(group => (
              <div 
              key={group.id} 
              onClick={() => onSelect(group)} // Open chat with group
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition border border-slate-200 dark:border-slate-700/50 hover:border-blue-500/30"
              >
              <div className="relative">
                  <img src={group.photos[0]} alt={group.name} className="w-12 h-12 rounded-lg object-cover" />
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{group.name}</h3>
                      <span className="text-[10px] text-slate-500">1h ago</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs truncate font-italic text-blue-500 dark:text-blue-400">Alice: Meeting this weekend?</p>
              </div>
              </div>
          ))}
          </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.Matching);
  const [selectedChatMatch, setSelectedChatMatch] = useState<MatchCandidate | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  
  // Settings State
  const settings = currentUser.settings || { theme: 'dark', language: 'vi', notifications: true };
  const t = TRANSLATIONS[settings.language];

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Request Location on Mount
  useEffect(() => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setCurrentUser(prev => ({
                      ...prev,
                      coordinates: {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                      }
                  }));
              },
              (error) => {
                  console.error("Location error", error);
              }
          );
      }
  }, []);

  const handleStartChat = (match: MatchCandidate) => {
    setSelectedChatMatch(match);
    setCurrentTab(AppTab.Chat);
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    setCurrentUser(prev => ({ ...prev, settings: newSettings }));
  };

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
      setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const renderContent = () => {
    if (selectedChatMatch && currentTab === AppTab.Chat) {
      return (
        <Chat 
            match={selectedChatMatch} 
            onBack={() => setSelectedChatMatch(null)} 
            language={settings.language}
            settings={settings}
            onUpdateSettings={handleSettingsChange}
        />
      );
    }

    switch (currentTab) {
      case AppTab.Community:
        return <Community language={settings.language} />;
      case AppTab.Matching:
        return (
          <Matching 
            candidates={MOCK_CANDIDATES} 
            user={currentUser}
            onChatStart={handleStartChat}
            language={settings.language}
          />
        );
      case AppTab.Groups:
        return (
          <Matching 
            candidates={MOCK_GROUPS} 
            user={currentUser}
            isGroup={true} 
            onChatStart={handleStartChat}
            language={settings.language}
          />
        );
      case AppTab.Chat:
        return <MatchList onSelect={setSelectedChatMatch} language={settings.language} />;
      case AppTab.Profile:
        return (
            <Profile 
                user={currentUser} 
                onSettingsChange={handleSettingsChange} 
                onUpdateProfile={handleProfileUpdate}
                language={settings.language}
            />
        );
      default:
        return (
          <Matching 
            candidates={MOCK_CANDIDATES} 
            user={currentUser}
            onChatStart={handleStartChat}
            language={settings.language}
          />
        );
    }
  };

  return (
    <div className="h-screen w-full bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col overflow-hidden font-sans transition-colors duration-300">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>

      {/* Bottom Navigation (Sticky) */}
      {!selectedChatMatch && (
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 h-16 flex items-center justify-around z-50 absolute bottom-0 w-full transition-colors duration-300">
          <NavButton 
            active={currentTab === AppTab.Community} 
            onClick={() => setCurrentTab(AppTab.Community)} 
            icon={<LayoutGrid size={24} />} 
            label={t.tab_community} 
          />
          <NavButton 
            active={currentTab === AppTab.Groups} 
            onClick={() => setCurrentTab(AppTab.Groups)} 
            icon={<Users size={24} />} 
            label={t.tab_groups} 
          />
          <div className="relative -top-6">
            <button 
              onClick={() => setCurrentTab(AppTab.Matching)}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${currentTab === AppTab.Matching ? 'bg-gradient-to-tr from-pink-500 to-purple-600 scale-110' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
              <Heart fill={currentTab === AppTab.Matching ? 'white' : 'none'} size={28} className={currentTab === AppTab.Matching ? 'text-white' : ''} />
            </button>
          </div>
          <NavButton 
            active={currentTab === AppTab.Chat} 
            onClick={() => setCurrentTab(AppTab.Chat)} 
            icon={<MessageCircle size={24} />} 
            label={t.tab_chat} 
          />
          <NavButton 
            active={currentTab === AppTab.Profile} 
            onClick={() => setCurrentTab(AppTab.Profile)} 
            icon={<User size={24} />} 
            label={t.tab_profile} 
          />
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${active ? 'text-pink-600 dark:text-pink-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </button>
);

export default App;
