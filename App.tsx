


import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, User, LayoutGrid, MapPin } from 'lucide-react';
import { AppTab, MatchCandidate, UserSettings, UserProfile, DatePlan, Conversation, ChatMessage, UserGender } from './types';
import { Community } from './components/Community';
import { Matching } from './components/Matching';
import { Chat } from './components/Chat';
import { Profile } from './components/Profile';
import { CURRENT_USER, getMockCandidates, getMockGroups, TRANSLATIONS, INITIAL_CONVERSATIONS } from './constants';

// --- Match List Component with New Sections ---
const MatchList = ({ 
    conversations, 
    candidates, 
    onSelect, 
    language 
}: { 
    conversations: Record<string, Conversation>, 
    candidates: MatchCandidate[], 
    onSelect: (m: MatchCandidate) => void, 
    language: 'vi'|'en' 
}) => {
  const t = TRANSLATIONS[language];
  const primaryColor = CURRENT_USER.gender === UserGender.Male ? 'blue' : 'pink';
  
  // Logic: 
  // "Messages" are candidates who exist in 'conversations' with > 1 message (more than just the intro greeting from match)
  // "New Matches" are candidates who exist in 'conversations' but have minimal history OR don't have conversation yet but are matched (mock logic: all mock candidates are "matched")
  
  // For this demo, we assume MOCK_CANDIDATES are people we matched with.
  // We check if they have a "real" conversation started.
  const activeChats = candidates.filter(c => {
      const conv = conversations[c.id];
      // Considered active if conversation exists and has user interaction (length > 2 implies user replied)
      return conv && conv.messages.length > 2;
  });

  const newMatches = candidates.filter(c => {
      const conv = conversations[c.id];
      return !conv || conv.messages.length <= 2;
  });

  return (
    <div className="bg-white dark:bg-slate-900 h-full overflow-y-auto pb-24 text-slate-900 dark:text-white flex flex-col">
      <div className="p-4 pb-2">
          <h2 className={`text-2xl font-bold text-${primaryColor}-600 dark:text-${primaryColor}-500 mb-6`}>{t.tab_chat}</h2>
          
          {/* Section 1: New Matches (Horizontal Scroll) */}
          <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className={`w-2 h-2 bg-${primaryColor}-500 rounded-full`}></div>
                  {t.chat_new_matches} <span className={`text-${primaryColor}-500`}>{newMatches.length}</span>
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {newMatches.map(match => (
                      <div 
                        key={match.id} 
                        onClick={() => onSelect(match)}
                        className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] group"
                      >
                          <div className="relative">
                              <img src={match.photos[0]} className={`w-16 h-16 rounded-2xl object-cover border-2 border-transparent group-hover:border-${primaryColor}-500 transition-all`} alt={match.name} />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                          </div>
                          <span className="text-xs font-bold truncate w-full text-center">{match.name.split(' ')[0]}</span>
                      </div>
                  ))}
                  {newMatches.length === 0 && <p className="text-xs text-slate-400 italic">No new matches yet.</p>}
              </div>
          </div>

          {/* Section 2: Messages (Vertical List) */}
          <div>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t.chat_messages}</h3>
              <div className="space-y-1">
                  {activeChats.map(match => {
                      const lastMsg = conversations[match.id].messages[conversations[match.id].messages.length - 1];
                      return (
                        <div 
                        key={match.id} 
                        onClick={() => onSelect(match)}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition border border-transparent"
                        >
                        <div className="relative">
                            <img src={match.photos[0]} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{match.name}</h3>
                                <span className="text-[10px] text-slate-500">
                                    {Math.floor((Date.now() - lastMsg.timestamp) / 60000)}m
                                </span>
                            </div>
                            <p className={`text-xs truncate ${lastMsg.senderId === 'me' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
                                {lastMsg.senderId === 'me' ? 'You: ' : ''}{lastMsg.text}
                            </p>
                        </div>
                        </div>
                  )})}
                   {activeChats.length === 0 && <p className="text-sm text-slate-500 text-center py-4 italic">Start chatting with your matches!</p>}
              </div>
          </div>
      </div>
    </div>
  );
};

const LocationRequestScreen = ({ onGrant, language }: { onGrant: () => void, language: 'vi'|'en' }) => {
    const t = TRANSLATIONS[language];
    const primaryColor = CURRENT_USER.gender === UserGender.Male ? 'blue' : 'pink';
    
    return (
        <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
            <div className={`w-24 h-24 bg-${primaryColor}-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse`}>
                <MapPin className={`w-10 h-10 text-${primaryColor}-500`} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{t.loc_permission_title}</h1>
            <p className="text-slate-400 mb-8 max-w-xs">{t.loc_permission_desc}</p>
            <button 
                onClick={onGrant}
                className={`bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-${primaryColor}-600/30 transition-transform active:scale-95`}
            >
                {t.grant_permission}
            </button>
        </div>
    )
}

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.Matching);
  const [selectedChatMatch, setSelectedChatMatch] = useState<MatchCandidate | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [locationGranted, setLocationGranted] = useState(false);
  
  // Persistent Chat State
  const [conversations, setConversations] = useState<Record<string, Conversation>>(INITIAL_CONVERSATIONS);
  
  // Settings State
  const settings = currentUser.settings || { theme: 'dark', language: 'vi', notifications: true };
  const t = TRANSLATIONS[settings.language];
  const primaryColor = currentUser.gender === UserGender.Male ? 'blue' : 'pink';

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const requestLocation = () => {
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
                  setLocationGranted(true);
              },
              (error) => {
                  console.error("Location error", error);
                  alert("Location access is required for AI features.");
              }
          );
      } else {
          alert("Geolocation is not supported by this browser.");
      }
  };

  const handleStartChat = (match: MatchCandidate, suggestion?: DatePlan) => {
    // Check if conversation exists, if not initialize it
    if (!conversations[match.id]) {
        const initialMessages: ChatMessage[] = [
            { id: '1', senderId: match.id, text: t.msg_hello, timestamp: Date.now() - 10000, type: 'text' },
            { id: '2', senderId: match.id, text: t.msg_intro, timestamp: Date.now() - 8000, type: 'text' },
        ];
        
        // If we have a suggestion from the matching screen, add the system message
        if (suggestion) {
            initialMessages.push({
                id: 'sys_loc', 
                senderId: 'ai', 
                text: `${t.sys_ai_plan_ready} ${suggestion.name}. ${t.sys_check_sidebar}`,
                timestamp: Date.now() - 5000,
                type: 'location_suggestion'
            });
        }

        setConversations(prev => ({
            ...prev,
            [match.id]: {
                matchId: match.id,
                messages: initialMessages,
                datePlan: suggestion,
                lastMessageTime: Date.now(),
                unreadCount: 0
            }
        }));
    } else if (suggestion && !conversations[match.id].datePlan) {
        // Update existing conversation with new plan if it didn't have one
        setConversations(prev => ({
            ...prev,
            [match.id]: {
                ...prev[match.id],
                datePlan: suggestion
            }
        }));
    }

    setSelectedChatMatch(match);
    setCurrentTab(AppTab.Chat);
  };

  const handleSendMessage = (text: string, type: ChatMessage['type'] = 'text') => {
      if (!selectedChatMatch) return;
      
      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: type === 'location_suggestion' ? 'ai' : 'me', // simplistic check
          text: text,
          timestamp: Date.now(),
          type: type
      };

      setConversations(prev => {
          const prevConv = prev[selectedChatMatch.id];
          return {
              ...prev,
              [selectedChatMatch.id]: {
                  ...prevConv,
                  messages: [...prevConv.messages, newMessage],
                  lastMessageTime: Date.now()
              }
          };
      });
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    setCurrentUser(prev => ({ ...prev, settings: newSettings }));
  };

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
      setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  // Get current data based on language setting
  const candidates = getMockCandidates(settings.language);
  const groups = getMockGroups(settings.language);

  if (!locationGranted) {
      return <LocationRequestScreen onGrant={requestLocation} language={settings.language} />;
  }

  const renderContent = () => {
    if (selectedChatMatch && currentTab === AppTab.Chat) {
      const activeConv = conversations[selectedChatMatch.id];
      return (
        <Chat 
            match={selectedChatMatch} 
            onBack={() => setSelectedChatMatch(null)} 
            language={settings.language}
            settings={settings}
            onUpdateSettings={handleSettingsChange}
            suggestedSpot={activeConv?.datePlan}
            messages={activeConv?.messages || []}
            onSendMessage={handleSendMessage}
        />
      );
    }

    switch (currentTab) {
      case AppTab.Community:
        return <Community language={settings.language} />;
      case AppTab.Matching:
        return (
          <Matching 
            candidates={candidates} 
            user={currentUser}
            onChatStart={handleStartChat}
            language={settings.language}
          />
        );
      case AppTab.Groups:
        return (
          <Matching 
            candidates={groups} 
            user={currentUser}
            isGroup={true} 
            onChatStart={handleStartChat}
            language={settings.language}
          />
        );
      case AppTab.Chat:
        return (
            <MatchList 
                conversations={conversations}
                candidates={[...candidates, ...groups]} 
                onSelect={(m) => handleStartChat(m)} 
                language={settings.language} 
            />
        );
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
            candidates={candidates} 
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
            primaryColor={primaryColor}
          />
          <NavButton 
            active={currentTab === AppTab.Groups} 
            onClick={() => setCurrentTab(AppTab.Groups)} 
            icon={<Users size={24} />} 
            label={t.tab_groups} 
            primaryColor={primaryColor}
          />
          <div className="relative -top-6">
            <button 
              onClick={() => setCurrentTab(AppTab.Matching)}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${currentTab === AppTab.Matching ? `bg-gradient-to-tr from-${primaryColor}-500 to-purple-600 scale-110` : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
              <Heart fill={currentTab === AppTab.Matching ? 'white' : 'none'} size={28} className={currentTab === AppTab.Matching ? 'text-white' : ''} />
            </button>
          </div>
          <NavButton 
            active={currentTab === AppTab.Chat} 
            onClick={() => setCurrentTab(AppTab.Chat)} 
            icon={<MessageCircle size={24} />} 
            label={t.tab_chat} 
            primaryColor={primaryColor}
          />
          <NavButton 
            active={currentTab === AppTab.Profile} 
            onClick={() => setCurrentTab(AppTab.Profile)} 
            icon={<User size={24} />} 
            label={t.tab_profile} 
            primaryColor={primaryColor}
          />
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, primaryColor }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, primaryColor: string }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${active ? `text-${primaryColor}-600 dark:text-${primaryColor}-500` : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </button>
);

export default App;
