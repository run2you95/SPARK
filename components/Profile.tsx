
import React, { useState } from 'react';
import { UserProfile, UserSettings } from '../types';
import { TRANSLATIONS } from '../constants';
import { Camera, Instagram, Music, Facebook, Chrome, Save, Settings, CreditCard, ChevronRight, Moon, Sun, Globe, LogOut, Wallet, CheckCircle, Loader2 } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onSettingsChange: (settings: UserSettings) => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  language: 'vi' | 'en';
}

export const Profile: React.FC<ProfileProps> = ({ user, onSettingsChange, onUpdateProfile, language }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
  const [bio, setBio] = useState(user.bio);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isConnectingSpotify, setIsConnectingSpotify] = useState(false);
  
  const t = TRANSLATIONS[language];
  const currentSettings = user.settings || { theme: 'dark', language: 'vi', notifications: true };

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
      if (user.socials.google === 'connected') return;

      setIsConnectingGoogle(true);
      
      // Simulate OAuth Delay
      setTimeout(() => {
          setIsConnectingGoogle(false);
          onUpdateProfile({
              name: "Nguyen Van A (Verified)",
              email: "nguyen.vana.official@gmail.com", 
              photos: ["https://lh3.googleusercontent.com/a/ACg8ocL-..."], // Mock Google Avatar URL
              isVerified: true,
              socials: { ...user.socials, google: 'connected' }
          });
          alert(language === 'vi' ? "Đã kết nối thành công với Google!" : "Successfully connected with Google!");
      }, 2000);
  };

  const handleConnectSpotify = () => {
    if (user.socials.spotify === 'connected') return;

    setIsConnectingSpotify(true);
    setTimeout(() => {
        setIsConnectingSpotify(false);
        onUpdateProfile({
            socials: { ...user.socials, spotify: 'connected' },
            spotifyTopTracks: [
                { id: 'new1', name: 'vampire', artist: 'Olivia Rodrigo', cover: 'https://picsum.photos/60/60?random=501' },
                { id: 'new2', name: 'Cruel Summer', artist: 'Taylor Swift', cover: 'https://picsum.photos/60/60?random=502' },
                { id: 'new3', name: 'Paint The Town Red', artist: 'Doja Cat', cover: 'https://picsum.photos/60/60?random=503' }
            ]
        });
        alert(language === 'vi' ? "Đã kết nối Spotify!" : "Spotify Connected!");
    }, 1500);
  };

  const renderInfoTab = () => (
    <div className="space-y-6 max-w-md mx-auto animate-fade-in">
        {/* Bio Section */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-pink-600 dark:text-pink-400 uppercase font-bold">{t.profile_bio}</label>
                <span className="text-[10px] text-slate-400">{bio.length}/500</span>
            </div>
            <textarea 
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm border border-slate-200 dark:border-slate-700"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
        </div>

        {/* Social Data Widgets */}
        <div className="grid grid-cols-1 gap-4">
            {/* Spotify Widget */}
            <div className="bg-gradient-to-br from-green-900/90 to-slate-900 p-4 rounded-xl border border-green-500/30 text-white shadow-lg overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-2 opacity-20"><Music className="w-16 h-16" /></div>
                 <h3 className="text-sm font-bold flex items-center gap-2 mb-3"><Music className="w-4 h-4" /> Top Spotify Tracks</h3>
                 
                 {user.socials.spotify === 'connected' && user.spotifyTopTracks && user.spotifyTopTracks.length > 0 ? (
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
                    <div className="relative z-10 flex flex-col items-center justify-center py-4 bg-black/20 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-slate-300 mb-3 text-center px-4">{t.connect_spotify_msg}</p>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-full transition shadow-lg shadow-green-900/50"
                        >
                            {t.connect_btn}
                        </button>
                    </div>
                 )}
            </div>

            {/* Instagram Widget */}
            <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 p-4 rounded-xl border border-pink-500/30 text-white shadow-lg">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-3"><Instagram className="w-4 h-4" /> Latest Posts</h3>
                <div className="grid grid-cols-3 gap-2">
                    {user.instagramPosts?.map(post => (
                        <div key={post.id} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer">
                            <img src={post.imageUrl} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" alt="insta" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <span className="text-[10px] font-bold">❤️ {post.likes}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition flex items-center justify-center gap-2 active:scale-95">
            <Save className="w-4 h-4" /> {t.profile_save}
        </button>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6 max-w-md mx-auto animate-fade-in">
        {/* App Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t.profile_settings}</h3>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750" onClick={toggleTheme}>
                    <div className="flex items-center gap-3">
                        {currentSettings.theme === 'dark' ? <Moon className="w-5 h-5 text-purple-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                        <div className="text-sm text-slate-700 dark:text-slate-200">{t.profile_theme}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 capitalize">{currentSettings.theme}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                </div>

                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750" onClick={toggleLanguage}>
                    <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <div className="text-sm text-slate-700 dark:text-slate-200">{t.profile_language}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{currentSettings.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t.profile_accounts}</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {/* Google Connection Item */}
                <div className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Chrome className="w-5 h-5 text-yellow-500" />
                        <div className="flex flex-col">
                             <span className="text-sm text-slate-700 dark:text-slate-200">Google</span>
                             {user.email && <span className="text-[10px] text-slate-500">{user.email}</span>}
                        </div>
                     </div>
                     <button 
                        onClick={handleConnectGoogle}
                        disabled={user.socials.google === 'connected' || isConnectingGoogle}
                        className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 transition ${
                            user.socials.google === 'connected'
                            ? 'border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/10' 
                            : 'border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                     >
                         {isConnectingGoogle ? <Loader2 className="w-3 h-3 animate-spin"/> : null}
                         {user.socials.google === 'connected' ? t.connected : t.not_connected}
                     </button>
                </div>

                {[
                    { 
                        icon: Instagram, 
                        color: 'text-pink-500', 
                        name: 'Instagram', 
                        status: user.socials.instagram === 'connected',
                        action: () => {}
                    },
                    { 
                        icon: Music, 
                        color: 'text-green-500', 
                        name: 'Spotify', 
                        status: user.socials.spotify === 'connected',
                        loading: isConnectingSpotify,
                        action: handleConnectSpotify
                    },
                    { 
                        icon: Facebook, 
                        color: 'text-blue-600', 
                        name: 'Facebook', 
                        status: user.socials.facebook === 'connected',
                        action: () => {}
                    },
                ].map((acc, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <acc.icon className={`w-5 h-5 ${acc.color}`} />
                            <span className="text-sm text-slate-700 dark:text-slate-200">{acc.name}</span>
                        </div>
                        <button 
                            onClick={acc.action}
                            disabled={acc.status || acc.loading}
                            className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 transition ${
                                acc.status 
                                ? 'border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/10' 
                                : 'border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {acc.loading && <Loader2 className="w-3 h-3 animate-spin" />}
                            {acc.status ? t.connected : t.not_connected}
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
             <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t.profile_payment}</h3>
                <button className="text-[10px] bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 px-2 py-1 rounded font-bold">+ Add</button>
            </div>
            <div className="p-4 space-y-3">
                {user.paymentMethods?.map(pm => (
                    <div key={pm.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div className="w-10 h-7 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase">{pm.type}</div>
                            <div className="text-xs text-slate-500">**** **** **** {pm.last4}</div>
                        </div>
                        <span className="text-xs text-slate-400">{pm.expiry}</span>
                    </div>
                ))}
                {/* Wallet Balance Mock */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Wallet className="w-5 h-5" />
                        <span className="text-sm">{t.wallet_balance}</span>
                     </div>
                     <span className="text-pink-600 font-bold text-lg">250.000đ</span>
                </div>
            </div>
        </div>

        <button className="w-full text-red-500 py-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition">
            <LogOut className="w-4 h-4" /> {t.profile_logout}
        </button>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white pb-24 transition-colors duration-300">
        <div className="flex flex-col items-center pt-8 pb-6 px-4 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
            <div className="relative group">
                <img src={user.photos[0]} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-pink-500 shadow-xl" />
                <button className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 hover:text-pink-500 transition shadow-md">
                    <Camera className="w-4 h-4" />
                </button>
            </div>
            <h2 className="text-2xl font-bold mt-4 flex items-center gap-2">
                {user.name}
                {user.isVerified && <CheckCircle className="w-5 h-5 text-blue-500" />}
            </h2>
            <div className="flex items-center gap-2 mt-1">
                 <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                    {user.isVerified ? 'Verified Account' : 'Member'}
                 </span>
            </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center my-6">
            <div className="bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'info' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    {t.tab_profile}
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <Settings className="w-4 h-4" /> {t.chat_settings}
                </button>
            </div>
        </div>

        <div className="px-4">
            {activeTab === 'info' ? renderInfoTab() : renderSettingsTab()}
        </div>
    </div>
  );
};
