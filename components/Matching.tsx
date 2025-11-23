
import React, { useState, useEffect } from 'react';
import { UserProfile, MatchCandidate } from '../types';
import { TRANSLATIONS } from '../constants';
import { GeminiService } from '../services/geminiService';
import { MapPin, Info, Check, X, ChevronDown, ChevronUp, Star, Clock, Users, Heart, MessageCircle } from 'lucide-react';

interface MatchingProps {
  candidates: MatchCandidate[];
  user: UserProfile;
  isGroup?: boolean;
  onChatStart?: (candidate: MatchCandidate) => void;
  language: 'vi' | 'en';
}

export const Matching: React.FC<MatchingProps> = ({ candidates, user, isGroup = false, onChatStart, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCandidate, setCurrentCandidate] = useState<MatchCandidate | null>(candidates[0] || null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  
  const t = TRANSLATIONS[language];

  useEffect(() => {
      setCurrentCandidate(candidates[currentIndex]);
      setSuggestion(null);
      // Auto analyze when card changes
      if (candidates[currentIndex]) {
          handleAnalyze(candidates[currentIndex]);
      }
  }, [currentIndex, candidates, language]);

  const handleAnalyze = async (candidate: MatchCandidate) => {
      setAnalyzing(true);
      const plan = await GeminiService.suggestDatePlan(user, candidate, language);
      setSuggestion(plan);
      setAnalyzing(false);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
        // Show Match Modal
        setShowMatchModal(true);
    } else {
        // Pass immediately (Next)
        handleNavigate('down');
    }
  };

  const handleNavigate = (direction: 'up' | 'down') => {
      if (direction === 'down') {
          if (currentIndex < candidates.length - 1) {
              setCurrentIndex(prev => prev + 1);
          } else {
              setCurrentIndex(0);
          }
      } else {
          if (currentIndex > 0) {
              setCurrentIndex(prev => prev - 1);
          } else {
               setCurrentIndex(candidates.length - 1);
          }
      }
      setShowMatchModal(false);
  };

  const handleStartChatting = () => {
    if (currentCandidate && onChatStart) {
        onChatStart(currentCandidate);
    }
  };

  if (!currentCandidate) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <Star className="w-10 h-10 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.out_of_candidates}</h3>
              <p className="text-slate-400 mt-2">{t.come_back_later}</p>
          </div>
      );
  }

  // Calculate shared interests
  const sharedInterests = currentCandidate.interests.filter(i => 
    user.interests.includes(i)
  );

  return (
    <div className="h-full bg-black relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="absolute top-0 w-full z-20 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <h2 className="text-white font-bold text-lg drop-shadow-md text-center">
            {isGroup ? t.group_title : t.match_title} <span className="text-pink-500">AI</span>
          </h2>
      </div>

      {/* Main Split Content - 50/50 Layout */}
      <div className="flex-1 flex flex-row h-full pb-20"> 
        
        {/* Left: User Profile (Me) */}
        <div className="w-1/2 relative border-r border-slate-800 h-full overflow-hidden">
             {/* Full Background Image */}
             <img 
                src={user.photos[0]} 
                alt="Me" 
                className="w-full h-full object-cover absolute inset-0 opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 pb-24 text-white z-10 overflow-y-auto max-h-full no-scrollbar">
                <div className="mb-2">
                    <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded text-white mb-1 inline-block shadow shadow-blue-500/50">YOU</span>
                    <h3 className="text-xl md:text-3xl font-bold leading-tight">{user.name}</h3>
                    <p className="text-xs md:text-sm text-slate-300">{user.age} • {user.location}</p>
                </div>
                
                <p className="text-xs md:text-sm text-slate-200 italic line-clamp-3 mb-3 opacity-90">"{user.bio}"</p>

                <div className="flex flex-wrap gap-1">
                    {user.interests.map(i => {
                        const isShared = sharedInterests.includes(i);
                        return (
                            <span key={i} className={`text-[10px] md:text-xs px-2 py-1 rounded border ${isShared ? 'bg-pink-600 border-pink-500 text-white animate-pulse' : 'bg-slate-800/80 border-slate-600 text-slate-300'}`}>
                                {i}
                            </span>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* Right: Candidate Info */}
        <div className="w-1/2 relative h-full overflow-hidden">
             <img 
                src={currentCandidate.photos[0]} 
                alt={currentCandidate.name}
                className="w-full h-full object-cover absolute inset-0 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 pb-24 text-white z-10 overflow-y-auto max-h-full no-scrollbar">
                <div className="flex flex-col mb-2">
                     <div className="flex justify-between items-end">
                        <span className="bg-pink-600 text-[10px] font-bold px-2 py-0.5 rounded text-white mb-1 inline-block shadow shadow-pink-500/50">{isGroup ? 'GROUP' : 'MATCH'}</span>
                        <div className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 border border-white/20">
                            <MapPin className="w-3 h-3 text-pink-500" /> {currentCandidate.distanceKm}{t.distance}
                        </div>
                     </div>
                    <h3 className="text-xl md:text-3xl font-bold leading-tight shadow-black drop-shadow-lg">{currentCandidate.name}</h3>
                    <p className="text-xs md:text-sm text-pink-200">
                        {currentCandidate.age}
                         <span className="ml-2 font-bold text-green-400">{currentCandidate.matchPercentage}% {t.match_percentage}</span>
                    </p>
                </div>

                <p className="text-xs md:text-sm text-slate-200 line-clamp-3 mb-3 pr-2 opacity-90">"{currentCandidate.bio}"</p>

                <div className="flex flex-wrap gap-1 mb-4">
                     {currentCandidate.interests.map(i => {
                        const isShared = sharedInterests.includes(i);
                        return (
                            <span key={i} className={`text-[10px] md:text-xs px-2 py-1 rounded border ${isShared ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-black/60 border-slate-600 text-slate-300'}`}>
                                {i}
                            </span>
                        )
                    })}
                </div>

                 {/* AI Suggestion Box */}
                 {suggestion ? (
                    <div className="bg-gradient-to-r from-purple-900/80 to-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-pink-500/30 shadow-2xl animate-fade-in">
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-[9px] font-bold text-yellow-400 uppercase">{t.ai_suggestion}</span>
                        </div>
                        <p className="text-xs font-bold text-white leading-tight">{suggestion.name}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-pink-200">
                             <Clock className="w-3 h-3" /> {suggestion.suggested_time}
                        </div>
                    </div>
                ) : (
                    <div className="text-[10px] text-slate-400 italic flex items-center gap-1">
                        {analyzing && <Star className="w-3 h-3 animate-spin text-yellow-500" />}
                        {analyzing ? t.analyzing : ''}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-20 w-full flex justify-center items-center gap-6 md:gap-10 z-30 pointer-events-none">
          <button 
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-slate-900/90 border border-slate-600 text-red-500 flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all shadow-xl shadow-black pointer-events-auto backdrop-blur-sm"
          >
              <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-2 pointer-events-auto">
             <button 
                onClick={() => handleNavigate('up')}
                className="w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-white/20 border border-white/10 backdrop-blur-sm shadow-lg active:scale-95"
             >
                <ChevronUp className="w-5 h-5" />
             </button>
             <button 
                onClick={() => handleNavigate('down')}
                className="w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-white/20 border border-white/10 backdrop-blur-sm shadow-lg active:scale-95"
             >
                <ChevronDown className="w-5 h-5" />
             </button>
          </div>

          <button 
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center hover:shadow-pink-500/50 hover:scale-110 transition-all shadow-xl shadow-black border border-white/20 pointer-events-auto"
          >
              <Heart className="w-7 h-7 fill-white" />
          </button>
      </div>

      {/* Match Found Modal */}
      {showMatchModal && currentCandidate && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
              <div className="text-center mb-8 relative">
                   <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 italic drop-shadow-[0_5px_5px_rgba(255,255,255,0.2)] transform -rotate-6">
                       {t.its_a_match}
                   </h1>
                   <p className="text-white mt-4 text-lg">You and <span className="font-bold text-pink-400">{currentCandidate.name}</span> have {sharedInterests.length} {t.match_common}.</p>
              </div>

              <div className="flex items-center justify-center gap-8 mb-10">
                  <img src={user.photos[0]} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 object-cover shadow-2xl shadow-blue-500/50" />
                  <div className="bg-white p-2 rounded-full shadow-lg shadow-pink-500/50 animate-pulse">
                      <Heart className="w-8 h-8 text-pink-600 fill-pink-600" />
                  </div>
                  <img src={currentCandidate.photos[0]} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-pink-500 object-cover shadow-2xl shadow-pink-500/50" />
              </div>

              <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button 
                    onClick={handleStartChatting}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3.5 rounded-full shadow-lg shadow-pink-600/30 hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                      <MessageCircle className="w-5 h-5" /> {t.btn_chat_now}
                  </button>
                  <button 
                    onClick={() => handleNavigate('down')}
                    className="w-full bg-slate-800 text-slate-300 font-bold py-3.5 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors"
                  >
                      {t.btn_keep_swiping}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
