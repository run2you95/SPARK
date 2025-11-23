


import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, MatchCandidate, DatePlan, MatchFilters, UserGender } from '../types';
import { TRANSLATIONS } from '../constants';
import { GeminiService } from '../services/geminiService';
import { MapPin, Info, Check, X, ChevronDown, ChevronUp, Star, Clock, Users, Heart, MessageCircle, SlidersHorizontal, Map as MapIcon, Calendar, Loader2, Lock } from 'lucide-react';

interface MatchingProps {
  candidates: MatchCandidate[];
  user: UserProfile;
  isGroup?: boolean;
  onChatStart?: (candidate: MatchCandidate, suggestion?: DatePlan) => void;
  language: 'vi' | 'en';
}

export const Matching: React.FC<MatchingProps> = ({ candidates: initialCandidates, user, isGroup = false, onChatStart, language }) => {
  // Filtering
  const [filters, setFilters] = useState<MatchFilters>({ ageRange: [18, 50], community: 'All', maxDistance: 50, minTimeFrame: 'any' });
  const [showFilters, setShowFilters] = useState(false);
  
  // Candidates
  const [filteredCandidates, setFilteredCandidates] = useState<MatchCandidate[]>(initialCandidates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCandidate, setCurrentCandidate] = useState<MatchCandidate | null>(null);
  
  // AI State
  const [suggestion, setSuggestion] = useState<DatePlan | null>(null);
  const [analyzing, setAnalyzing] = useState(false); 
  const [showMatchModal, setShowMatchModal] = useState(false);
  
  // Cache to store AI results so they don't reload when swiping back
  const planCache = useRef<Record<string, DatePlan>>({});
  
  const t = TRANSLATIONS[language];
  const primaryColor = user.gender === UserGender.Male ? 'blue' : 'pink';

  // Apply filters & React to language/candidate changes
  useEffect(() => {
      // Re-filter candidates if initialCandidates change (e.g. language swap) or filters change
      const filtered = initialCandidates.filter(c => 
          (isGroup ? true : (c.age >= filters.ageRange[0] && c.age <= filters.ageRange[1])) &&
          (c.distanceKm <= filters.maxDistance)
      );
      setFilteredCandidates(filtered);
      // Reset index only if out of bounds (allows seamless language switch)
      if (currentIndex >= filtered.length) {
          setCurrentIndex(0);
      }
  }, [filters, initialCandidates, isGroup]);

  // Analysis Effect: Runs in background when candidate changes
  useEffect(() => {
      const candidate = filteredCandidates[currentIndex] || null;
      setCurrentCandidate(candidate);
      setSuggestion(null);
      
      if (candidate) {
          // Check Cache First
          if (planCache.current[candidate.id]) {
              setSuggestion(planCache.current[candidate.id]);
              setAnalyzing(false);
              return;
          }

          // Do not block UI. Just start fetching.
          setAnalyzing(true);
          GeminiService.suggestDatePlan(user, candidate, language)
            .then(plan => {
                if (plan) {
                    planCache.current[candidate.id] = plan;
                    // Only update state if user is still on this candidate
                    if (currentCandidate?.id === candidate.id) {
                        setSuggestion(plan);
                    }
                }
                setAnalyzing(false);
            })
            .catch(() => setAnalyzing(false));
      }
  }, [currentIndex, filteredCandidates, language]); // currentCandidate is derived from currentIndex

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
        if (!suggestion) {
            // Cannot like if no suggestion yet
            return;
        }
        setShowMatchModal(true);
    } else {
        handleNavigate('down');
    }
  };

  const handleNavigate = (direction: 'up' | 'down') => {
      if (direction === 'down') {
          if (currentIndex < filteredCandidates.length - 1) {
              setCurrentIndex(prev => prev + 1);
          } else {
              setCurrentIndex(0);
          }
      } else {
          if (currentIndex > 0) {
              setCurrentIndex(prev => prev - 1);
          } else {
               setCurrentIndex(filteredCandidates.length - 1);
          }
      }
      setShowMatchModal(false);
  };

  const handleStartChatting = () => {
    if (currentCandidate && onChatStart) {
        onChatStart(currentCandidate, suggestion || undefined);
    }
  };

  if (!currentCandidate) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 relative">
               <button onClick={() => setShowFilters(true)} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-white">
                   <SlidersHorizontal size={20} />
               </button>
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <Star className="w-10 h-10 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.out_of_candidates}</h3>
              <p className="text-slate-400 mt-2">{t.come_back_later}</p>
          </div>
      );
  }

  // Calculate shared interests
  const sharedInterests = currentCandidate.interests.filter(i => user.interests.includes(i));

  return (
    <div className="h-full bg-black relative overflow-hidden flex flex-col">
      {/* Filters Modal */}
      {showFilters && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md p-6 flex flex-col animate-fade-in overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">{t.filters_title}</h2>
                  <button onClick={() => setShowFilters(false)} className="text-slate-400"><X /></button>
              </div>
              
              <div className="space-y-6">
                  {!isGroup && (
                      <div>
                          <label className={`text-${primaryColor}-500 font-bold mb-2 block`}>{t.filter_age}: {filters.ageRange[0]} - {filters.ageRange[1]}</label>
                          <input 
                            type="range" 
                            min="18" max="60" 
                            value={filters.ageRange[1]} 
                            onChange={(e) => setFilters({...filters, ageRange: [filters.ageRange[0], parseInt(e.target.value)]})}
                            className={`w-full accent-${primaryColor}-600`}
                          />
                      </div>
                  )}

                  <div>
                      <label className={`text-${primaryColor}-500 font-bold mb-2 block`}>{t.filter_dist}: {filters.maxDistance} km</label>
                      <input 
                        type="range" 
                        min="1" max="100" 
                        value={filters.maxDistance} 
                        onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
                        className={`w-full accent-${primaryColor}-600`}
                      />
                  </div>

                  <div>
                    <label className={`text-${primaryColor}-500 font-bold mb-2 block`}>{t.filter_time}</label>
                    <select 
                        value={filters.minTimeFrame}
                        onChange={(e) => setFilters({...filters, minTimeFrame: e.target.value as any})}
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none"
                    >
                        <option value="any">{t.time_any}</option>
                        <option value="asap">{t.time_asap}</option>
                        <option value="tonight">{t.time_tonight}</option>
                        <option value="weekend">{t.time_weekend}</option>
                    </select>
                  </div>

                  <div>
                      <label className={`text-${primaryColor}-500 font-bold mb-2 block`}>{t.filter_community}</label>
                      <div className="flex flex-wrap gap-2">
                          {['All', 'Tech', 'Art', 'Nightlife', 'Outdoors'].map(c => (
                              <button 
                                key={c}
                                onClick={() => setFilters({...filters, community: c})}
                                className={`px-4 py-2 rounded-full border ${filters.community === c ? `bg-${primaryColor}-600 border-${primaryColor}-600 text-white` : 'border-slate-700 text-slate-400'}`}
                              >
                                  {c === 'All' ? t.comm_all : c}
                              </button>
                          ))}
                      </div>
                  </div>
                  
                  <button onClick={() => setShowFilters(false)} className="w-full bg-white text-black font-bold py-3 rounded-full mt-8">{t.apply_filters}</button>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="absolute top-0 w-full z-20 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none flex justify-between items-start">
          <div className="w-10"></div>
          <h2 className="text-white font-bold text-lg drop-shadow-md text-center">
            {isGroup ? t.group_title : t.match_title} <span className={`text-${primaryColor}-500`}>AI</span>
          </h2>
          <button onClick={() => setShowFilters(true)} className="pointer-events-auto p-2 bg-black/40 backdrop-blur rounded-full text-white hover:bg-white/20 transition">
              <SlidersHorizontal size={20} />
          </button>
      </div>

      {/* Main Split Content - 50/50 Layout */}
      <div className="flex-1 flex flex-row h-full pb-20"> 
        {/* Left: User Profile (Me) */}
        <div className="w-1/2 relative border-r border-slate-800 h-full overflow-hidden">
             <img src={user.photos[0]} alt="Me" className="w-full h-full object-cover absolute inset-0 opacity-60 grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 pb-24 text-white z-10 overflow-y-auto max-h-full no-scrollbar">
                <div className="mb-2">
                    <span className={`bg-${primaryColor}-600 text-[10px] font-bold px-2 py-0.5 rounded text-white mb-1 inline-block shadow shadow-${primaryColor}-500/50`}>YOU</span>
                    <h3 className="text-xl md:text-3xl font-bold leading-tight">{user.name}</h3>
                    <p className="text-xs md:text-sm text-slate-300">{user.age} • {user.location}</p>
                </div>
            </div>
        </div>

        {/* Right: Candidate Info */}
        <div className="w-1/2 relative h-full overflow-hidden">
             <img src={currentCandidate.photos[0]} alt={currentCandidate.name} className="w-full h-full object-cover absolute inset-0 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 pb-24 text-white z-10 overflow-y-auto max-h-full no-scrollbar">
                <div className="flex flex-col mb-2">
                     <div className="flex justify-between items-end">
                        <span className={`bg-pink-600 text-[10px] font-bold px-2 py-0.5 rounded text-white mb-1 inline-block shadow shadow-pink-500/50`}>{isGroup ? 'GROUP' : 'MATCH'}</span>
                        <div className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 border border-white/20">
                            <MapPin className="w-3 h-3 text-pink-500" /> {currentCandidate.distanceKm}{t.distance}
                        </div>
                     </div>
                    <h3 className="text-xl md:text-3xl font-bold leading-tight shadow-black drop-shadow-lg">{currentCandidate.name}</h3>
                    <p className="text-xs md:text-sm text-pink-200">
                        {currentCandidate.age}
                         <span className="ml-2 font-bold text-green-400">{currentCandidate.matchPercentage}% {t.match_percentage}</span>
                    </p>
                    
                    {/* Explicit Common Interests */}
                    {sharedInterests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {sharedInterests.map(interest => (
                                <span key={interest} className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-md border border-green-500/30">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                 {/* AI Suggestion Box - Fixed Height Container to prevent Jumping */}
                 <div className="h-28 transition-all duration-500 relative">
                    {suggestion ? (
                        <div className={`absolute inset-0 bg-gradient-to-r from-purple-900/90 to-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-${primaryColor}-500/50 shadow-2xl animate-fade-in mb-4`}>
                            <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span className="text-[10px] font-bold text-yellow-400 uppercase">{t.ai_suggestion}</span>
                            </div>
                            <div className="flex items-start gap-2 mb-2">
                                <div className={`bg-${primaryColor}-600 p-1.5 rounded-lg text-white`}><MapIcon size={14} /></div>
                                <div>
                                    <p className="text-xs font-bold text-white leading-tight line-clamp-1">{suggestion.name}</p>
                                    <p className="text-[10px] text-slate-300 line-clamp-1">{suggestion.address}</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2 text-[10px] text-${primaryColor}-200 bg-black/20 p-1.5 rounded-lg`}>
                                <Clock className="w-3 h-3" /> 
                                <span className="font-bold">{suggestion.suggested_time}</span>
                            </div>
                        </div>
                    ) : (
                        analyzing && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl mb-4 flex items-center justify-center gap-2 animate-pulse">
                            <Loader2 className={`w-4 h-4 animate-spin text-${primaryColor}-500`} />
                            <span className="text-[10px] font-bold text-slate-300">{t.analyzing}</span>
                        </div>
                        )
                    )}
                 </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-20 w-full flex justify-center items-center gap-6 md:gap-10 z-30 pointer-events-none">
          <button 
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full border flex items-center justify-center transition-all shadow-xl shadow-black pointer-events-auto backdrop-blur-sm bg-slate-900/90 border-slate-600 text-red-500 hover:bg-red-500/20 hover:scale-110"
          >
              <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-2 pointer-events-auto">
             <button onClick={() => handleNavigate('up')} className="w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-white/20 border border-white/10 backdrop-blur-sm shadow-lg active:scale-95"><ChevronUp className="w-5 h-5" /></button>
             <button onClick={() => handleNavigate('down')} className="w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-white/20 border border-white/10 backdrop-blur-sm shadow-lg active:scale-95"><ChevronDown className="w-5 h-5" /></button>
          </div>

          <div className="relative">
            <button 
                onClick={() => handleSwipe('right')}
                disabled={!suggestion}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl shadow-black border pointer-events-auto border-white/20 ${!suggestion ? 'bg-slate-800 text-slate-500 grayscale cursor-not-allowed' : `bg-gradient-to-r from-${primaryColor}-500 to-purple-600 text-white hover:shadow-${primaryColor}-500/50 hover:scale-110`}`}
            >
                {suggestion ? <Heart className="w-7 h-7 fill-white" /> : <Lock className="w-6 h-6" />}
            </button>
            {!suggestion && analyzing && <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-black/80 text-white px-2 py-1 rounded">{t.wait_for_ai}</div>}
          </div>
      </div>

      {/* Match Found Modal */}
      {showMatchModal && currentCandidate && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
              <div className="text-center mb-8 relative">
                   <h1 className={`text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-${primaryColor}-500 via-red-500 to-yellow-500 italic drop-shadow-[0_5px_5px_rgba(255,255,255,0.2)] transform -rotate-6`}>{t.its_a_match}</h1>
                   <p className="text-white mt-4 text-lg">You and <span className={`font-bold text-${primaryColor}-400`}>{currentCandidate.name}</span> have {sharedInterests.length} {t.match_common}.</p>
              </div>

              <div className="flex items-center justify-center gap-8 mb-10">
                  <img src={user.photos[0]} className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-${primaryColor}-500 object-cover shadow-2xl shadow-${primaryColor}-500/50`} />
                  <div className={`bg-white p-2 rounded-full shadow-lg shadow-${primaryColor}-500/50 animate-pulse`}><Heart className={`w-8 h-8 text-${primaryColor}-600 fill-${primaryColor}-600`} /></div>
                  <img src={currentCandidate.photos[0]} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-pink-500 object-cover shadow-2xl shadow-pink-500/50" />
              </div>

              <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button onClick={handleStartChatting} className={`w-full bg-gradient-to-r from-${primaryColor}-600 to-purple-600 text-white font-bold py-3.5 rounded-full shadow-lg shadow-${primaryColor}-600/30 hover:scale-105 transition-transform flex items-center justify-center gap-2`}><MessageCircle className="w-5 h-5" /> {t.btn_chat_now}</button>
                  <button onClick={() => handleNavigate('down')} className="w-full bg-slate-800 text-slate-300 font-bold py-3.5 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors">{t.btn_keep_swiping}</button>
              </div>
          </div>
      )}
    </div>
  );
};
