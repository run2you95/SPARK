
import React, { useState, useRef, useEffect } from 'react';
import { MatchCandidate, ChatMessage, UserSettings } from '../types';
import { GeminiService } from '../services/geminiService';
import { TRANSLATIONS, CHAT_BACKGROUNDS, CURRENT_USER } from '../constants';
import { Send, Map as MapIcon, DollarSign, Image as ImageIcon, Settings, Phone, Video, MapPin, ExternalLink, Navigation, Palette } from 'lucide-react';

interface ChatProps {
  match: MatchCandidate;
  onBack: () => void;
  language: 'vi' | 'en';
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
}

interface LocationSuggestion {
    name: string;
    link: string;
    text: string;
}

export const Chat: React.FC<ChatProps> = ({ match, onBack, language, settings, onUpdateSettings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', senderId: match.id, text: language === 'vi' ? 'Chào đằng ấy! 👋' : 'Hey there! 👋', timestamp: Date.now() - 10000, type: 'text' },
      { id: '2', senderId: match.id, text: language === 'vi' ? 'Thấy profile bạn thú vị quá, mình làm quen nhé?' : 'Loved your profile, want to chat?', timestamp: Date.now() - 8000, type: 'text' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showWhoPays, setShowWhoPays] = useState(false);
  const [payPrediction, setPayPrediction] = useState<{payer: string, reason: string} | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [suggestedLocation, setSuggestedLocation] = useState<LocationSuggestion | null>(null);
  const [loadingMap, setLoadingMap] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[language];
  const bgClass = CHAT_BACKGROUNDS.find(b => b.value === settings.chatBackground)?.value || settings.chatBackground || 'bg-slate-900';

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
      if (!inputValue.trim()) return;
      const newMsg: ChatMessage = {
          id: Date.now().toString(),
          senderId: CURRENT_USER.id,
          text: inputValue,
          timestamp: Date.now(),
          type: 'text'
      };
      setMessages([...messages, newMsg]);
      setInputValue('');
  };

  const handleWhoPays = async () => {
      setShowWhoPays(true);
      setPayPrediction(null);
      const result = await GeminiService.predictWhoPays(CURRENT_USER, match, language);
      setPayPrediction(result);
  };

  const handleSuggestLocation = async () => {
      setLoadingMap(true);
      const askMsg: ChatMessage = {
          id: Date.now().toString(),
          senderId: CURRENT_USER.id,
          text: t.chat_suggest_location + " 📍",
          timestamp: Date.now(),
          type: 'text'
      };
      setMessages(prev => [...prev, askMsg]);

      // Call AI with current locations
      const result = await GeminiService.findMeetingSpot(CURRENT_USER.location, match.location, language);
      
      setLoadingMap(false);
      
      if (result.placeName) {
          setSuggestedLocation({
              name: result.placeName,
              link: result.mapLink || `https://www.google.com/maps/search/${encodeURIComponent(result.placeName)}`,
              text: result.text
          });
          
          const botMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              senderId: 'ai',
              text: result.text,
              timestamp: Date.now(),
              type: 'location_suggestion'
          };
          setMessages(prev => [...prev, botMsg]);
          setShowMap(true);
      }
  };

  return (
    <div className={`flex flex-col h-full ${bgClass} bg-cover bg-center transition-all duration-500`}>
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-slate-900/90 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-slate-400 hover:text-white">←</button>
            <div className="relative">
                <img src={match.photos[0]} className="w-10 h-10 rounded-full object-cover border border-slate-600" alt="avatar" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
                <h3 className="font-bold text-white text-sm">{match.name}</h3>
                <p className="text-xs text-slate-400">{t.chat_online}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 text-pink-500">
            <button><Phone className="w-5 h-5" /></button>
            <button><Video className="w-5 h-5" /></button>
            <button onClick={() => setShowSettings(!showSettings)}>
                <Settings className={`w-5 h-5 ${showSettings ? 'text-white' : ''}`} />
            </button>
        </div>
      </div>

      {/* Split View: Map & Chat */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Settings Panel Overlay */}
          {showSettings && (
             <div className="absolute top-0 right-0 z-30 w-64 bg-slate-800 shadow-xl border-l border-white/10 h-full p-4 animate-slide-in-right">
                 <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                     <Palette className="w-4 h-4" /> {t.chat_bg_title}
                 </h4>
                 <div className="grid grid-cols-2 gap-2">
                     {CHAT_BACKGROUNDS.map(bg => (
                         <div 
                            key={bg.id}
                            onClick={() => onUpdateSettings({ ...settings, chatBackground: bg.value })}
                            className={`h-16 rounded-lg cursor-pointer border-2 transition ${settings.chatBackground === bg.value ? 'border-pink-500 scale-105' : 'border-transparent hover:border-white/50'} ${bg.value} bg-cover`}
                            title={bg.name}
                         />
                     ))}
                 </div>
                 <button 
                    onClick={() => setShowSettings(false)}
                    className="mt-6 w-full py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 text-sm"
                 >
                     Close
                 </button>
             </div>
          )}

          {/* Map Panel */}
          {showMap && (
              <div className="h-64 md:h-full md:w-5/12 bg-slate-800 relative border-b md:border-b-0 md:border-r border-slate-700 transition-all duration-300">
                  {suggestedLocation ? (
                      <div className="w-full h-full relative">
                          <iframe
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                              referrerPolicy="no-referrer-when-downgrade"
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(suggestedLocation.name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>
                          
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                              <div className="bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-600 shadow-xl">
                                  <MapPin className="w-4 h-4 text-pink-500" />
                                  <div className="text-xs">
                                      <div className="font-bold text-pink-400">{t.location_found}</div>
                                      <div className="max-w-[150px] truncate">{suggestedLocation.name}</div>
                                  </div>
                              </div>
                          </div>

                          <div className="absolute bottom-4 right-4 flex gap-2">
                               <a 
                                  href={suggestedLocation.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg flex items-center gap-1 text-xs font-bold px-3 transition"
                               >
                                   <ExternalLink className="w-4 h-4" /> {t.open_maps}
                               </a>
                          </div>
                      </div>
                  ) : null}
                  
                  <button 
                    onClick={() => setShowMap(false)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white md:hidden z-20"
                  >
                      ✕
                  </button>
              </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col relative bg-black/20 backdrop-blur-sm">
              {!showMap && (
                  <button onClick={() => setShowMap(true)} className="absolute top-2 right-2 z-10 bg-slate-800 p-2 rounded-full text-pink-500 shadow-lg md:hidden">
                      <MapIcon className="w-5 h-5" />
                  </button>
              )}

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => {
                      const isMe = msg.senderId === CURRENT_USER.id;
                      const isAi = msg.senderId === 'ai';
                      
                      return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              {isAi && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                                      <Navigation className="w-4 h-4 text-white" />
                                  </div>
                              )}
                              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                  isMe ? 'bg-pink-600 text-white rounded-br-none' : 
                                  isAi ? 'bg-slate-800 border border-pink-500/30 text-slate-200' :
                                  'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                              }`}>
                                  {isAi && <div className="text-xs text-pink-400 font-bold mb-1 uppercase">AI BOT</div>}
                                  <div className="whitespace-pre-wrap">{msg.text}</div>
                                  
                                  {isAi && suggestedLocation && (
                                      <div className="mt-3 pt-3 border-t border-slate-600">
                                          <a href={suggestedLocation.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition text-xs font-semibold">
                                              <ExternalLink className="w-3 h-3" /> Maps
                                          </a>
                                      </div>
                                  )}
                              </div>
                          </div>
                      );
                  })}
                  {loadingMap && (
                      <div className="flex justify-start">
                          <div className="bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-400 animate-pulse">
                              {t.location_searching}
                          </div>
                      </div>
                  )}
              </div>

              {/* Toolbar */}
              <div className="p-2 bg-slate-900/50 backdrop-blur flex gap-2 overflow-x-auto no-scrollbar">
                  <button 
                    onClick={handleWhoPays}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 text-green-400 rounded-full text-xs font-bold whitespace-nowrap hover:bg-green-600/30 transition border border-green-600/20"
                  >
                      <DollarSign className="w-3 h-3" /> {t.chat_who_pays}
                  </button>
                  <button 
                    onClick={handleSuggestLocation}
                    disabled={loadingMap}
                    className="flex items-center gap-1 px-3 py-1.5 bg-pink-600/20 text-pink-400 rounded-full text-xs font-bold whitespace-nowrap hover:bg-pink-600/30 transition border border-pink-600/20"
                  >
                      <MapPin className="w-3 h-3" /> {t.chat_suggest_location}
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold whitespace-nowrap hover:bg-blue-600/30 transition border border-blue-600/20">
                      <ImageIcon className="w-3 h-3" /> {t.chat_send_photo}
                  </button>
              </div>

              {/* Input */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                  <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.chat_input_placeholder}
                    className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-pink-500 border border-slate-700 focus:border-pink-500 transition-all"
                  />
                  <button onClick={handleSend} className="bg-pink-600 p-2.5 rounded-full hover:bg-pink-500 text-white transition shadow-lg shadow-pink-600/20">
                      <Send className="w-5 h-5" />
                  </button>
              </div>
          </div>
      </div>

      {/* Modal: Who Pays */}
      {showWhoPays && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-green-500/30 shadow-2xl relative overflow-hidden animate-scale-in">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" /> {t.chat_who_pays}
                  </h3>
                  
                  {payPrediction ? (
                      <div className="text-center">
                          <div className="text-4xl font-black text-green-400 mb-2 drop-shadow-md">{payPrediction.payer}</div>
                          <p className="text-slate-300 text-sm italic bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                              "{payPrediction.reason}"
                          </p>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center py-4">
                           <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mb-2"></div>
                           <p className="text-xs text-green-400 animate-pulse">AI is thinking...</p>
                      </div>
                  )}

                  <button 
                    onClick={() => setShowWhoPays(false)}
                    className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition"
                  >
                      Close
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
