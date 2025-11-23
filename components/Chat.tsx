


import React, { useState, useRef, useEffect } from 'react';
import { MatchCandidate, ChatMessage, UserSettings, DatePlan, UserGender } from '../types';
import { GeminiService } from '../services/geminiService';
import { TRANSLATIONS, CHAT_BACKGROUNDS, CURRENT_USER } from '../constants';
import { Send, Map as MapIcon, DollarSign, Image as ImageIcon, Settings, Phone, Video, MapPin, ExternalLink, Navigation, Palette, Upload, User, ArrowRight, Wallet, Check, ChevronDown, Heart, Clock, Pencil, RefreshCw, Dice5 } from 'lucide-react';

interface ChatProps {
  match: MatchCandidate;
  onBack: () => void;
  language: 'vi' | 'en';
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  suggestedSpot?: DatePlan;
  messages: ChatMessage[];
  onSendMessage: (text: string, type: ChatMessage['type']) => void;
}

export const Chat: React.FC<ChatProps> = ({ match, onBack, language, settings, onUpdateSettings, suggestedSpot, messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [activeLocation, setActiveLocation] = useState<DatePlan | null>(suggestedSpot || null);
  const [loadingMap, setLoadingMap] = useState(false);
  
  // Who Pays State (Slider value: 0 = Me, 50 = Split, 100 = Them)
  const [paymentSliderValue, setPaymentSliderValue] = useState(50);
  const [isRandomizing, setIsRandomizing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[language];
  const currentBg = settings.chatBackground || 'bg-slate-900';
  const isPreset = CHAT_BACKGROUNDS.some(b => b.value === currentBg);
  const isCustom = !isPreset && !currentBg.startsWith('bg-');
  const primaryColor = CURRENT_USER.gender === UserGender.Male ? 'blue' : 'pink';

  useEffect(() => {
    if (suggestedSpot) {
        setActiveLocation(suggestedSpot);
        // Set initial slider based on AI suggestion
        if (suggestedSpot.whoPays?.payer === 'Me') setPaymentSliderValue(0);
        else if (suggestedSpot.whoPays?.payer === 'Them') setPaymentSliderValue(100);
        else setPaymentSliderValue(50);
    }
  }, [suggestedSpot]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
      if (!inputValue.trim()) return;
      onSendMessage(inputValue, 'text');
      setInputValue('');
  };

  const handleSuggestNewLocation = async () => {
      setLoadingMap(true);
      onSendMessage(t.chat_suggest_location + " 📍", 'text');
      const result = await GeminiService.suggestDatePlan(CURRENT_USER, match, language);
      setLoadingMap(false);
      if (result) {
          setActiveLocation(result);
          onSendMessage(`${t.location_found} ${result.name}!`, 'location_suggestion');
      }
  };

  const handleChangeTime = () => {
      const newTime = prompt(t.prompt_new_time, activeLocation?.suggested_time || "19:00");
      if (newTime && activeLocation) {
          setActiveLocation({ ...activeLocation, suggested_time: newTime });
      }
  };
  
  const handleRandomizePayer = () => {
      setIsRandomizing(true);
      const duration = 1500;
      const interval = 100;
      const startTime = Date.now();
      
      const timer = setInterval(() => {
          const randomVal = Math.random() * 100;
          setPaymentSliderValue(randomVal);
          
          if (Date.now() - startTime > duration) {
              clearInterval(timer);
              setIsRandomizing(false);
              // Snap to one of 3 positions
              const final = Math.random();
              if (final < 0.33) setPaymentSliderValue(0);
              else if (final < 0.66) setPaymentSliderValue(50);
              else setPaymentSliderValue(100);
          }
      }, interval);
  };

  const getPayerLabel = (val: number) => {
      if (val < 25) return t.payer_me;
      if (val > 75) return t.payer_them;
      return t.payer_split;
  };
  
  const getSliderColor = (val: number) => {
      if (val < 25) return `bg-${primaryColor}-500`; // Me
      if (val > 75) return 'bg-pink-500'; // Them (Usually opponent is assumed female if user male, but keeping static pink for 'Them' contrast or could be dynamic)
      // Actually if user is Male (Blue), "Them" being Pink makes sense. If User is Female (Pink), "Them" might be Blue. 
      // For simplicity, let's keep "Them" as contrasting or static, but let's make "Me" follow primaryColor.
      return 'bg-purple-500'; // Split
  };

  const userDist = activeLocation?.coordinates && CURRENT_USER.coordinates 
      ? GeminiService.calculateDistance(CURRENT_USER.coordinates.lat, CURRENT_USER.coordinates.lng, activeLocation.coordinates.lat, activeLocation.coordinates.lng)
      : (activeLocation ? 2.5 : 0);
  const matchDist = activeLocation ? (match.distanceKm - userDist > 0 ? (match.distanceKm - userDist).toFixed(1) : (userDist + 1.2).toFixed(1)) : 0; 
  const sharedInterests = match.interests.filter(i => CURRENT_USER.interests.includes(i));

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-slate-900">
      
      {/* 1. Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-slate-900 z-30 shadow-lg relative">
        <div className="flex items-center gap-3 w-1/3">
            <button onClick={onBack} className="text-slate-400 hover:text-white mr-2">←</button>
            <div className="relative">
                 <img src={CURRENT_USER.photos[0]} className={`w-10 h-10 rounded-full object-cover border-2 border-${primaryColor}-600`} alt="me" />
                 <div className="absolute -bottom-1 -right-1 bg-slate-800 text-[8px] px-1 rounded text-white font-bold border border-slate-600">YOU</div>
            </div>
            <div className="hidden md:block"><h3 className="font-bold text-white text-sm truncate max-w-[100px]">{CURRENT_USER.name}</h3></div>
        </div>
        <div className={`flex items-center justify-center gap-4 text-${primaryColor}-500 w-1/3`}>
            <button className="p-2 hover:bg-white/10 rounded-full transition"><Phone className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-white/10 rounded-full transition"><Video className="w-5 h-5" /></button>
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-white/10 rounded-full transition"><Settings className={`w-5 h-5 ${showSettings ? 'text-white' : ''}`} /></button>
        </div>
        <div className="flex items-center justify-end gap-3 w-1/3">
            <div className="text-right hidden md:block"><h3 className="font-bold text-white text-sm truncate max-w-[100px]">{match.name}</h3><p className="text-xs text-green-400 font-bold">{match.matchPercentage}% Match</p></div>
            <div className="relative">
                <img src={match.photos[0]} className="w-10 h-10 rounded-full object-cover border-2 border-pink-500" alt="match" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100%-64px)] relative">
          
          {/* SIDE PANEL */}
          <div className="h-[45%] md:h-full md:w-[40%] bg-slate-800 relative border-b md:border-b-0 md:border-r border-slate-700 shadow-xl z-10 flex flex-col overflow-y-auto no-scrollbar">
              <div className="bg-slate-850 p-3 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2"><Heart className={`w-4 h-4 text-${primaryColor}-500 fill-${primaryColor}-500`} /><span className="text-xs font-bold text-white uppercase tracking-wider">Common Interests</span></div>
                  <div className="flex -space-x-1">
                      {sharedInterests.slice(0, 3).map(i => <div key={i} className="bg-slate-700 text-[10px] text-slate-300 px-2 py-0.5 rounded-full border border-slate-800">{i}</div>)}
                      {sharedInterests.length > 3 && <div className="bg-slate-700 text-[10px] text-slate-300 px-2 py-0.5 rounded-full border border-slate-800">+{sharedInterests.length - 3}</div>}
                  </div>
              </div>

              {activeLocation ? (
                  <>
                    <div className="relative h-48 w-full shrink-0 border-b border-slate-700">
                        <iframe width="100%" height="100%" className="invert-0 grayscale-0 brightness-100 contrast-100 opacity-80" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${encodeURIComponent(activeLocation.name + ' ' + activeLocation.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}></iframe>
                    </div>
                    <div className="bg-slate-900 p-2 border-b border-slate-700 flex items-center justify-between shadow-inner">
                            <div className="flex flex-col items-center w-16"><span className={`text-[9px] text-${primaryColor}-400 font-bold`}>YOU</span><div className={`h-1 w-full bg-${primaryColor}-500/30 rounded-full mt-1`}></div></div>
                            <div className="flex-1 flex flex-col items-center px-1"><span className="text-[9px] text-slate-500">{userDist}km</span><div className="h-0.5 w-full bg-slate-700"></div></div>
                            <div className="flex flex-col items-center"><MapPin className={`w-4 h-4 text-${primaryColor}-500`} /></div>
                            <div className="flex-1 flex flex-col items-center px-1"><span className="text-[9px] text-slate-500">~{matchDist}km</span><div className="h-0.5 w-full bg-slate-700"></div></div>
                            <div className="flex flex-col items-center w-16"><span className="text-[9px] text-pink-400 font-bold">THEM</span><div className="h-1 w-full bg-pink-500/30 rounded-full mt-1"></div></div>
                    </div>

                    <div className="p-4 flex-1">
                        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                             <div className="flex justify-between items-center mb-3">
                                 <h4 className={`text-sm font-bold text-${primaryColor}-400 uppercase tracking-wider flex items-center gap-2`}><Check className="w-4 h-4" /> AI Date Plan</h4>
                             </div>
                             
                             <div className="space-y-4">
                                 <div className="flex gap-3 relative group">
                                     <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0"><MapIcon className="w-4 h-4 text-slate-400"/></div>
                                     <div className="flex-1">
                                         <div className="text-sm font-bold text-white pr-6">{activeLocation.name}</div>
                                         <div className="text-xs text-slate-400">{activeLocation.address}</div>
                                         <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeLocation.name)}`} target="_blank" className={`text-[10px] text-${primaryColor}-400 hover:underline flex items-center gap-1 mt-1`}>Open Maps <ExternalLink className="w-3 h-3"/></a>
                                     </div>
                                     <button onClick={handleSuggestNewLocation} disabled={loadingMap} className="absolute right-0 top-0 text-slate-500 hover:text-white p-1" title="Suggest New Location">{loadingMap ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Pencil className="w-3 h-3"/>}</button>
                                 </div>
                                 
                                 <div className="flex gap-3 relative group">
                                     <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-slate-400"/></div>
                                     <div className="flex-1"><div className="text-sm font-bold text-white">Suggested Time</div><div className="text-xs text-slate-400">{activeLocation.suggested_time}</div></div>
                                     <button onClick={handleChangeTime} className="absolute right-0 top-0 text-slate-500 hover:text-white p-1" title="Change Time"><Pencil className="w-3 h-3"/></button>
                                 </div>

                                 {/* Interactive Payer Slider */}
                                 <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                                     <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-white"><Wallet className="w-3 h-3" /> {t.chat_who_pays}</div>
                                        <button onClick={handleRandomizePayer} className={`text-[10px] flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full hover:bg-slate-600 transition ${isRandomizing ? 'text-yellow-400' : 'text-slate-300'}`}>
                                            <Dice5 className={`w-3 h-3 ${isRandomizing ? 'animate-spin' : ''}`} /> {t.payer_random}
                                        </button>
                                     </div>
                                     
                                     <div className="relative h-6 w-full flex items-center">
                                         {/* Track */}
                                         <div className="absolute inset-x-0 h-2 bg-slate-600 rounded-full overflow-hidden">
                                             <div className={`h-full bg-gradient-to-r from-${primaryColor}-500 via-purple-500 to-pink-500 opacity-50`}></div>
                                         </div>
                                         {/* Thumb */}
                                         <input 
                                            type="range" min="0" max="100" step="1"
                                            value={paymentSliderValue}
                                            onChange={(e) => setPaymentSliderValue(parseInt(e.target.value))}
                                            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                                         />
                                         <div 
                                            className={`absolute h-6 w-6 rounded-full border-2 border-white shadow-lg transition-all duration-75 pointer-events-none flex items-center justify-center z-0 ${getSliderColor(paymentSliderValue)}`}
                                            style={{ left: `calc(${paymentSliderValue}% - 12px)` }}
                                         >
                                             {paymentSliderValue < 25 ? <User size={12} className="text-white"/> : 
                                              paymentSliderValue > 75 ? <Heart size={12} className="text-white fill-white"/> : 
                                              <div className="text-[10px] font-bold text-white">½</div>}
                                         </div>
                                     </div>

                                     <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                                         <span className={paymentSliderValue < 25 ? `text-${primaryColor}-400` : ''}>{t.payer_me}</span>
                                         <span className={paymentSliderValue >= 25 && paymentSliderValue <= 75 ? 'text-purple-400' : ''}>{t.payer_split}</span>
                                         <span className={paymentSliderValue > 75 ? 'text-pink-400' : ''}>{t.payer_them}</span>
                                     </div>
                                     
                                     <p className="text-[9px] text-slate-500 mt-3 italic text-center border-t border-slate-700/50 pt-2">
                                         Selected: <strong className="text-white">{getPayerLabel(paymentSliderValue)}</strong> 
                                         {!isRandomizing && activeLocation.whoPays && <span className="block mt-0.5 text-slate-600">(AI Suggestion: {activeLocation.whoPays.reason})</span>}
                                     </p>
                                 </div>
                             </div>
                        </div>
                    </div>
                  </>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center bg-slate-900">
                      <MapIcon className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm">No location selected.</p>
                      <button onClick={handleSuggestNewLocation} className={`mt-2 text-${primaryColor}-500 text-xs font-bold hover:underline`}>Find a spot?</button>
                  </div>
              )}
          </div>

          {/* CHAT SECTION */}
          <div className={`flex-1 flex flex-col relative transition-all duration-500 ${!isCustom ? currentBg : 'bg-slate-900'}`} style={isCustom ? { backgroundImage: `url(${currentBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 backdrop-blur-[2px]">
                  {messages.map(msg => {
                      const isMe = msg.senderId === CURRENT_USER.id;
                      const isAi = msg.senderId === 'ai';
                      return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                              {isAi && <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${primaryColor}-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0 border border-white/20`}><Navigation className="w-4 h-4 text-white" /></div>}
                              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-md ${isMe ? `bg-${primaryColor}-600 text-white rounded-bl-none` : isAi ? `bg-slate-800/90 backdrop-blur border border-${primaryColor}-500/30 text-slate-200` : 'bg-white/90 dark:bg-slate-700/90 backdrop-blur text-slate-800 dark:text-slate-200 rounded-br-none'}`}>
                                  {isAi && <div className={`text-[10px] text-${primaryColor}-400 font-bold mb-1 uppercase tracking-wider`}>AI Assistant</div>}
                                  <div className="whitespace-pre-wrap">{msg.text}</div>
                              </div>
                          </div>
                      );
                  })}
                  {loadingMap && <div className="flex justify-center"><div className="bg-slate-800 rounded-full px-4 py-1 text-xs text-slate-400 animate-pulse flex items-center gap-2 border border-slate-700"><RefreshCw className="w-3 h-3 animate-spin"/> {t.location_searching}</div></div>}
              </div>
              <div className="p-2 bg-slate-900/80 backdrop-blur border-t border-slate-700 flex gap-2 overflow-x-auto no-scrollbar">
                  <button onClick={handleSuggestNewLocation} disabled={loadingMap} className={`flex items-center gap-1 px-3 py-1.5 bg-${primaryColor}-900/40 text-${primaryColor}-400 rounded-full text-xs font-bold whitespace-nowrap hover:bg-${primaryColor}-900/60 transition border border-${primaryColor}-500/30`}><MapPin className="w-3 h-3" /> {t.chat_suggest_location}</button>
                  <button onClick={handleChangeTime} className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/40 text-blue-400 rounded-full text-xs font-bold whitespace-nowrap hover:bg-blue-900/60 transition border border-blue-500/30"><Clock className="w-3 h-3" /> {t.chat_change_time}</button>
              </div>
              <div className="p-3 bg-slate-900 flex gap-2">
                  <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={t.chat_input_placeholder} className={`flex-1 bg-slate-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-${primaryColor}-500 border border-slate-700 focus:border-${primaryColor}-500 transition-all`} />
                  <button onClick={handleSend} className={`bg-${primaryColor}-600 p-2.5 rounded-full hover:bg-${primaryColor}-500 text-white transition shadow-lg shadow-${primaryColor}-600/20 active:scale-95`}><Send className="w-5 h-5" /></button>
              </div>
              {showSettings && (
                    <div className="absolute inset-0 z-40 bg-slate-900/95 p-6 animate-fade-in flex flex-col">
                        <div className="flex justify-between items-center mb-6"><h4 className="text-white font-bold text-lg flex items-center gap-2"><Palette className={`w-5 h-5 text-${primaryColor}-500`} /> {t.chat_bg_title}</h4><button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white"><Settings className="w-6 h-6"/></button></div>
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4">
                            {CHAT_BACKGROUNDS.map(bg => (
                                <div key={bg.id} onClick={() => onUpdateSettings({ ...settings, chatBackground: bg.value })} className={`h-24 rounded-xl cursor-pointer border-2 transition relative overflow-hidden group ${settings.chatBackground === bg.value ? `border-${primaryColor}-500 ring-2 ring-${primaryColor}-500/30` : 'border-slate-700 hover:border-slate-500'}`}>
                                    <div className={`absolute inset-0 ${bg.value} bg-cover bg-center`}></div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><span className="text-xs font-bold text-white">{bg.name}</span></div>
                                    {settings.chatBackground === bg.value && <div className={`absolute top-2 right-2 bg-${primaryColor}-500 rounded-full p-1`}><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
          </div>
      </div>
    </div>
  );
};
