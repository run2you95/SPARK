


import React, { useState } from 'react';
import { UserProfile, UserSettings, UserGender } from '../types';
import { TRANSLATIONS } from '../constants';
import { Camera, Instagram, Music, Facebook, Chrome, Save, Settings, CreditCard, ChevronRight, Moon, Sun, Globe, LogOut, Wallet, CheckCircle, Loader2, Pencil, X, Plus, Calendar, Briefcase, Grid, User as UserIcon } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onSettingsChange: (settings: UserSettings) => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  language: 'vi' | 'en';
}

type SocialKey = keyof UserProfile['socials'];

export const Profile: React.FC<ProfileProps> = ({ user, onSettingsChange, onUpdateProfile, language }) => {
  const [activeTab, setActiveTab] = useState<'wall' | 'info'>('wall'); // 'wall' (Tường) or 'info' (Thông tin)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Info Form State
  const [bio, setBio] = useState(user.bio);
  const [job, setJob] = useState(user.job || '');
  const [birthday, setBirthday] = useState(user.birthday || '');
  const [newInterest, setNewInterest] = useState('');
  
  // Connect States
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isConnectingSpotify, setIsConnectingSpotify] = useState(false);
  const [editSocialModal, setEditSocialModal] = useState<{ key: SocialKey, name: string, value: string } | null>(null);

  const t = TRANSLATIONS[language];
  const currentSettings = user.settings || { theme: 'dark', language: 'vi', notifications: true };
  const primaryColor = user.gender === UserGender.Male ? 'blue' : 'pink';

  const isConnected = (status?: string) => status && status !== 'not_connected';

  const toggleTheme = () => {
    onSettingsChange({
      ...currentSettings,
      theme: currentSettings.theme === 'dark' ? 'light' : 'dark'
    });
  };

  const toggleLanguage = () => {
    onSettingsChange({
      ...currentSettings,
      language: currentSettings.language === 'vi' ? 'en' : 'vi'
    });
  };

  const handleConnectGoogle = () => {
      if (isConnected(user.socials.google)) return;
      setIsConnectingGoogle(true);
      setTimeout(() => {
          setIsConnectingGoogle(false);
          onUpdateProfile({
              name: "Nguyen Van A (Verified)",
              email: "nguyen.vana.official@gmail.com", 
              photos: ["https://lh3.googleusercontent.com/a/ACg8ocL-..."],
              isVerified: true,
              socials: { ...user.socials, google: 'google.com/u/nguyenvana' }
          });
          alert(t.alert_google);
      }, 2000);
  };

  const handleConnectSpotify = () => {
    if (isConnected(user.socials.spotify)) return;
    setIsConnectingSpotify(true);
    setTimeout(() => {
        setIsConnectingSpotify(false);
        onUpdateProfile({
            socials: { ...user.socials, spotify: 'open.spotify.com/user/van_a_music' },
            spotifyTopTracks: [
                { id: 'new1', name: 'vampire', artist: 'Olivia Rodrigo', cover: 'https://picsum.photos/60/60?random=501' },
                { id: 'new2', name: 'Cruel Summer', artist: 'Taylor Swift', cover: 'https://picsum.photos/60/60?random=502' },
                { id: 'new3', name: 'Paint The Town Red', artist: 'Doja Cat', cover: 'https://picsum.photos/60/60?random=503' }
            ]
        });
        alert(t.alert_spotify);
    }, 1500);
  };

  const handleSaveSocialEdit = () => {
      if (!editSocialModal) return;
      onUpdateProfile({
          socials: { ...user.socials, [editSocialModal.key]: editSocialModal.value }
      });
      setEditSocialModal(null);
  };

  const openEditModal = (key: SocialKey, name: string) => {
      const currentVal = user.socials[key];
      setEditSocialModal({
          key,
          name,
          value: isConnected(currentVal) ? currentVal! : ''
      });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !user.interests.includes(newInterest.trim())) {
      onUpdateProfile({
        interests: [...user.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    onUpdateProfile({
      interests: user.interests.filter(i => i !== interest)
    });
  };

  const handleSaveInfo = () => {
      onUpdateProfile({ bio, job, birthday });
      // Show feedback?
  };

  const renderWallTab = () => (
      <div className="space-y-4 animate-fade-in">
          {/* Photos Grid (Mock) */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                  {user.photos.map((p, i) => <img key={i} src={p} className="w-full aspect-square object-cover rounded-lg" alt="me" />)}
                  {[1,2].map(n => <div key={n} className="w-full aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-300"><Plus /></div>)}
              </div>
          </div>

          {/* Social Integrations */}
          <div className="grid grid-cols-1 gap-4">
               {/* Spotify */}
              <div className="bg-gradient-to-br from-green-900/90 to-slate-900 p-4 rounded-xl border border-green-500/30 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20"><Music className="w-16 h-16" /></div>
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-3"><Music className="w-4 h-4" /> My Anthem</h3>
                  {isConnected(user.socials.spotify) && user.spotifyTopTracks?.length ? (
                      <div className="space-y-3 relative z-10">
                          {user.spotifyTopTracks.map((track, idx) => (
                              <div key={track.id} className="flex items-center gap-3">
                                  <div className="font-mono text-green-400 text-xs w-4">{idx + 1}</div>
                                  <img src={track.cover} className="w-10 h-10 rounded shadow" alt="cover" />
                                  <div className="flex-1 min-w-0">
                                      <div className="text-xs font-bold truncate">{track.name}</div>
                                      <div className="text-[10px] text-slate-300 truncate">{track.artist}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <button onClick={handleConnectSpotify} className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-full transition">{t.connect_btn}</button>
                  )}
              </div>
              
              {/* Insta */}
              <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 p-4 rounded-xl border border-pink-500/30 text-white shadow-lg">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-3"><Instagram className="w-4 h-4" /> Recent Moments</h3>
                  <div className="grid grid-cols-3 gap-2">
                      {user.instagramPosts?.map(post => (
                          <div key={post.id} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer">
                              <img src={post.imageUrl} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" alt="insta" />
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderInfoTab = () => (
      <div className="space-y-6 animate-fade-in max-w-md mx-auto">
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
               <div>
                   <label className={`text-xs text-${primaryColor}-600 dark:text-${primaryColor}-400 uppercase font-bold block mb-1`}>{t.profile_bio}</label>
                   <textarea 
                      className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm border border-slate-200 dark:border-slate-700"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className={`text-xs text-${primaryColor}-600 dark:text-${primaryColor}-400 uppercase font-bold block mb-1`}>{t.profile_job}</label>
                       <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                           <Briefcase size={14} className="text-slate-400"/>
                           <input value={job} onChange={e => setJob(e.target.value)} className="bg-transparent text-sm w-full outline-none dark:text-white" placeholder="Job title" />
                       </div>
                   </div>
                   <div>
                       <label className={`text-xs text-${primaryColor}-600 dark:text-${primaryColor}-400 uppercase font-bold block mb-1`}>{t.profile_bday}</label>
                       <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                           <Calendar size={14} className="text-slate-400"/>
                           <input value={birthday} onChange={e => setBirthday(e.target.value)} className="bg-transparent text-sm w-full outline-none dark:text-white" placeholder="DD/MM/YYYY" />
                       </div>
                   </div>
               </div>
          </div>

          {/* Interests */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <label className={`text-xs text-${primaryColor}-600 dark:text-${primaryColor}-400 uppercase font-bold block mb-3`}>{t.profile_interests}</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {user.interests.map(interest => (
                    <div key={interest} className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 group">
                      {interest}
                      <button onClick={() => handleRemoveInterest(interest)} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                    placeholder={t.type_interest}
                    className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700 outline-none"
                  />
                  <button onClick={handleAddInterest} className={`bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white p-2 rounded-lg`}><Plus size={18} /></button>
                </div>
          </div>

          <button onClick={handleSaveInfo} className={`w-full bg-gradient-to-r from-${primaryColor}-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-${primaryColor}-500/30 transition flex items-center justify-center gap-2 active:scale-95`}>
              <Save className="w-4 h-4" /> {t.profile_save}
          </button>
      </div>
  );

  const renderSettingsModal = () => {
    const SOCIAL_ACCOUNTS = [
        { key: 'google', name: 'Google', icon: Chrome, color: 'text-yellow-500', action: handleConnectGoogle, loading: isConnectingGoogle },
        { key: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', action: () => openEditModal('instagram', 'Instagram'), loading: false },
        { key: 'spotify', name: 'Spotify', icon: Music, color: 'text-green-500', action: handleConnectSpotify, loading: isConnectingSpotify },
        { key: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', action: () => openEditModal('facebook', 'Facebook'), loading: false },
    ] as const;

    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-4 animate-fade-in flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-0 overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur z-10">
                  <h3 className="font-bold text-lg dark:text-white flex items-center gap-2"><Settings className="w-5 h-5"/> {t.profile_settings}</h3>
                  <button onClick={() => setShowSettingsModal(false)} className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><X className="w-5 h-5 dark:text-white"/></button>
              </div>

              <div className="p-4 space-y-6">
                 {/* App Prefs */}
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold">Preferences</label>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-800">
                        <div onClick={toggleTheme} className="p-4 flex justify-between items-center cursor-pointer">
                            <span className="text-sm font-medium dark:text-white flex items-center gap-2">{currentSettings.theme === 'dark' ? <Moon size={16}/> : <Sun size={16}/>} {t.profile_theme}</span>
                            <span className="text-xs text-slate-400 capitalize">{currentSettings.theme}</span>
                        </div>
                        <div onClick={toggleLanguage} className="p-4 flex justify-between items-center cursor-pointer">
                            <span className="text-sm font-medium dark:text-white flex items-center gap-2"><Globe size={16}/> {t.profile_language}</span>
                            <span className="text-xs text-slate-400">{currentSettings.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                        </div>
                    </div>
                 </div>

                 {/* Accounts */}
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold">{t.profile_accounts}</label>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-800">
                        {SOCIAL_ACCOUNTS.map((acc, i) => {
                            const connected = isConnected(user.socials[acc.key as SocialKey]);
                            return (
                                <div key={i} className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <acc.icon className={`w-5 h-5 ${acc.color}`} />
                                        <span className="text-sm font-medium dark:text-white">{acc.name}</span>
                                    </div>
                                    {connected ? <CheckCircle size={18} className="text-green-500"/> : 
                                      <button onClick={acc.action} className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full dark:text-white">{t.not_connected}</button>
                                    }
                                </div>
                            )
                        })}
                    </div>
                 </div>

                 {/* Logout */}
                 <button className="w-full py-3 text-red-500 font-bold bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-center gap-2">
                    <LogOut size={18} /> {t.profile_logout}
                 </button>
              </div>
          </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 relative">
        {/* Header Profile */}
        <div className="relative">
             {/* Settings Button */}
             <button 
                onClick={() => setShowSettingsModal(true)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30"
             >
                 <Settings size={20} />
             </button>

            <div className="flex flex-col items-center pt-8 pb-6 px-4 bg-slate-900 text-white shadow-lg rounded-b-[2rem] relative z-10">
                <div className="relative group">
                    <img src={user.photos[0]} alt="Avatar" className={`w-24 h-24 rounded-full object-cover border-4 border-${primaryColor}-500 shadow-xl`} />
                    <button className="absolute bottom-0 right-0 bg-slate-800 p-1.5 rounded-full text-white border border-slate-600 hover:text-pink-500 transition">
                        <Camera className="w-3 h-3" />
                    </button>
                </div>
                <h2 className="text-xl font-bold mt-3 flex items-center gap-2">
                    {user.name}
                    {user.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                </h2>
                <p className="text-slate-300 text-sm">{job || 'Add job title'}</p>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center -mt-5 relative z-20 mb-4">
            <div className="bg-white dark:bg-slate-800 p-1 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex">
                <button 
                    onClick={() => setActiveTab('wall')}
                    className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'wall' ? `bg-${primaryColor}-600 text-white shadow` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <Grid size={16}/> {t.profile_wall}
                </button>
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'info' ? `bg-${primaryColor}-600 text-white shadow` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <UserIcon size={16}/> {t.profile_info}
                </button>
            </div>
        </div>

        <div className="px-4">
            {activeTab === 'wall' ? renderWallTab() : renderInfoTab()}
        </div>

        {showSettingsModal && renderSettingsModal()}

        {/* Edit Social Modal */}
        {editSocialModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.edit} {editSocialModal.name}</h3>
                    <div className="space-y-4">
                        <input 
                            value={editSocialModal.value}
                            onChange={(e) => setEditSocialModal({...editSocialModal, value: e.target.value})}
                            placeholder={t.link_placeholder}
                            className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-lg outline-none"
                        />
                        <div className="flex gap-3">
                             <button onClick={() => setEditSocialModal(null)} className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold">{t.cancel}</button>
                             <button onClick={handleSaveSocialEdit} className={`flex-1 py-3 rounded-xl bg-${primaryColor}-600 text-white font-bold`}>{t.save}</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
