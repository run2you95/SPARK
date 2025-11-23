


import React, { useEffect, useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { CommunityTopic, SocialPost, ReactionType, CategoryId, PostComment, UserGender } from '../types';
import { CURRENT_USER, getInitialTopics, getMockPosts, TRANSLATIONS, COMMUNITY_CATEGORIES, TRENDING_TAGS } from '../constants';
import { MessageCircle, Heart, Share2, Loader2, Send, Lock, ShieldCheck, Hash, Menu, ThumbsUp, Laugh, Frown, Angry, Smile, MoreHorizontal, Plus, Check, Globe, Dumbbell, Cpu, Coffee, Palette, Utensils, ChevronRight, Search, Zap } from 'lucide-react';

const ICONS: Record<string, any> = {
    Heart, Dumbbell, Cpu, Coffee, Palette, Utensils
};

export const Community: React.FC<{ language: 'vi' | 'en' }> = ({ language }) => {
  const [topics, setTopics] = useState<CommunityTopic[]>(getInitialTopics(language));
  const [posts, setPosts] = useState<SocialPost[]>(getMockPosts(language));
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);
  const [viewMode, setViewMode] = useState<'feed' | 'explore'>('feed'); 
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS[language];
  const followedTopics = topics.filter(t => t.isFollowed);
  const activeTopic = topics.find(t => t.id === selectedTopicId);
  const primaryColor = CURRENT_USER.gender === UserGender.Male ? 'blue' : 'pink';
  
  // Update data when language changes
  useEffect(() => {
    setTopics(getInitialTopics(language));
    setPosts(getMockPosts(language));
  }, [language]);

  useEffect(() => {
    if (followedTopics.length > 0 && !selectedTopicId && viewMode === 'feed') {
        setSelectedTopicId(followedTopics[0].id);
    } else if (followedTopics.length === 0 && viewMode === 'feed') {
        setViewMode('explore'); 
    }
  }, [topics]);

  const toggleFollow = (topicId: string) => {
      setTopics(prev => prev.map(t => 
          t.id === topicId ? { ...t, isFollowed: !t.isFollowed } : t
      ));
  };

  const handleReaction = (postId: string, type: ReactionType) => {
      setPosts(prev => prev.map(post => {
          if (post.id !== postId) return post;
          const oldReaction = post.userReaction;
          const newReactions = { ...post.reactions };
          if (oldReaction === type) {
              newReactions[type]--;
              return { ...post, reactions: newReactions, userReaction: undefined };
          } else {
              if (oldReaction) newReactions[oldReaction]--;
              newReactions[type]++;
              return { ...post, reactions: newReactions, userReaction: type };
          }
      }));
  };
  
  // New handler for simple click
  const handleSimpleLike = (postId: string) => {
      const post = posts.find(p => p.id === postId);
      if (post?.userReaction) {
          // If already reacted, remove it (toggle off)
          handleReaction(postId, post.userReaction);
      } else {
          // If not reacted, default to 'like'
          handleReaction(postId, 'like');
      }
  };

  const handleSubmitComment = (postId: string) => {
      const text = commentInputs[postId];
      if (!text?.trim()) return;
      const newComment: PostComment = {
          id: Date.now().toString(),
          userId: CURRENT_USER.id,
          userName: CURRENT_USER.name,
          userAvatar: CURRENT_USER.photos[0],
          text: text,
          timestamp: Date.now(),
          likes: 0
      };
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const ReactionBar = ({ post }: { post: SocialPost }) => {
      const reactionIcons: Record<ReactionType, { icon: React.ReactNode, color: string, label: string }> = {
          like: { icon: <ThumbsUp size={16} />, color: `text-${primaryColor}-500`, label: 'Like' },
          love: { icon: <Heart size={16} />, color: 'text-red-500', label: 'Love' },
          haha: { icon: <Laugh size={16} />, color: 'text-yellow-500', label: 'Haha' },
          wow: { icon: <Smile size={16} />, color: 'text-yellow-500', label: 'Wow' },
          sad: { icon: <Frown size={16} />, color: 'text-yellow-500', label: 'Sad' },
          angry: { icon: <Angry size={16} />, color: 'text-orange-500', label: 'Angry' }
      };
      const myReaction = post.userReaction ? reactionIcons[post.userReaction] : null;

      return (
          <div className="flex items-center justify-between pt-2 mt-2 relative group">
              <button 
                onClick={() => handleSimpleLike(post.id)}
                className={`flex items-center gap-2 group/btn hover:text-${primaryColor}-500 transition ${myReaction ? myReaction.color : 'text-slate-500 dark:text-slate-400'}`}
              >
                  <div className={`p-2 rounded-full group-hover/btn:bg-${primaryColor}-500/10`}>
                     {myReaction ? myReaction.icon : <Heart size={18} />}
                  </div>
                  <span className="text-sm font-medium">{Object.values(post.reactions).reduce((a, b) => a + b, 0) || ''}</span>
              </button>
              
              <button className={`flex items-center gap-2 group/btn hover:text-blue-500 text-slate-500 dark:text-slate-400 transition`}>
                  <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10">
                     <MessageCircle size={18} />
                  </div>
                  <span className="text-sm font-medium">{post.comments.length || ''}</span>
              </button>

              <button className="flex items-center gap-2 group/btn hover:text-green-500 text-slate-500 dark:text-slate-400 transition">
                  <div className="p-2 rounded-full group-hover/btn:bg-green-500/10">
                     <Share2 size={18} />
                  </div>
              </button>

              {/* Hover Menu for Specific Reactions */}
              <div className="absolute -top-8 left-0 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-600 p-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
                   {(Object.keys(reactionIcons) as ReactionType[]).map(type => (
                       <button key={type} onClick={(e) => { e.stopPropagation(); handleReaction(post.id, type); }} className="p-2 hover:scale-125 transition-transform bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">{reactionIcons[type].icon}</button>
                   ))}
              </div>
          </div>
      );
  };

  const renderExplore = () => {
      let displayTopics = selectedCategoryId 
        ? topics.filter(t => t.categoryId === selectedCategoryId)
        : topics;

      if (searchQuery.trim()) {
          const lowerQ = searchQuery.toLowerCase();
          displayTopics = topics.filter(t => 
             t.title.toLowerCase().includes(lowerQ) || 
             t.tags.some(tag => tag.toLowerCase().includes(lowerQ))
          );
      }

      return (
        <div className="p-4 h-full overflow-y-auto pb-24 bg-white dark:bg-slate-900 ml-[60px] md:mr-[300px]">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {selectedCategoryId && (
                            <button onClick={() => setSelectedCategoryId(null)} className="text-slate-500 hover:text-white mr-2">←</button>
                        )}
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {selectedCategoryId ? t[COMMUNITY_CATEGORIES.find(c => c.id === selectedCategoryId)?.name || ''] : t.explore_topics}
                        </h2>
                    </div>
                    <button onClick={() => setViewMode('feed')} className={`text-sm text-${primaryColor}-600 font-bold hover:underline`}>{t.back_to_feed}</button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5"/>
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.search_topics}
                        className={`w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-${primaryColor}-500 transition border border-transparent focus:border-${primaryColor}-500`}
                    />
                </div>
            </div>

            {selectedCategoryId || searchQuery ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    {displayTopics.length > 0 ? displayTopics.map(topic => (
                        <div key={topic.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition flex flex-col justify-between">
                            <div>
                                <h3 className={`font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2`}><Hash size={16} className={`text-${primaryColor}-500`}/> {topic.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{topic.description}</p>
                                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                                    <span>{topic.followers.toLocaleString()} followers</span>
                                    <span>{topic.likes} likes</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleFollow(topic.id)}
                                className={`mt-4 w-full py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition ${
                                    topic.isFollowed 
                                    ? 'bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300' 
                                    : 'bg-white text-black hover:bg-slate-200'
                                }`}
                            >
                                {topic.isFollowed ? t.followed : t.follow}
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-2 text-center text-slate-500 py-10">No topics found.</div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    {COMMUNITY_CATEGORIES.map(cat => {
                        const Icon = ICONS[cat.iconName] || Hash;
                        return (
                            <button 
                                key={cat.id} 
                                onClick={() => setSelectedCategoryId(cat.id)}
                                className={`bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-${primaryColor}-500 transition flex flex-col items-center gap-3 text-center group`}
                            >
                                <div className={`w-12 h-12 rounded-full bg-${primaryColor}-100 dark:bg-${primaryColor}-900/30 flex items-center justify-center text-${primaryColor}-600 dark:text-${primaryColor}-400 group-hover:scale-110 transition`}>
                                    <Icon size={24} />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">{t[cat.name]}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
      );
  };

  const renderFeed = () => (
      <div className="flex-1 flex flex-col h-full w-full relative ml-[60px] md:mr-[300px]">
          {/* Header */}
          <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur z-10 sticky top-0">
             <div className="flex items-center gap-3">
                  {activeTopic ? (
                      <div>
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">{activeTopic.title}</h3>
                          <span className="text-xs text-slate-500">{activeTopic.followers.toLocaleString()} posts</span>
                      </div>
                  ) : <div className="font-bold text-slate-500">Select Topic</div>}
             </div>
             <button onClick={() => setViewMode('explore')} className={`md:hidden text-xs font-bold text-${primaryColor}-600 border border-${primaryColor}-600 px-3 py-1.5 rounded-full hover:bg-${primaryColor}-50 dark:hover:bg-${primaryColor}-900/20`}>{t.add_topic}</button>
          </div>
          
          {/* Posts Feed */}
          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-black p-0 pb-20">
              {posts.filter(p => !activeTopic || p.topicId === activeTopic.id).length === 0 ? (
                  <div className="text-center py-10 text-slate-500">{t.no_posts}</div>
              ) : (
                  posts.filter(p => !activeTopic || p.topicId === activeTopic.id).map(post => (
                      <div key={post.id} className="bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                          <div className="flex gap-3">
                                <div className="relative shrink-0">
                                      <img src={post.authorAvatar} className="w-12 h-12 rounded-full object-cover" alt="avt" />
                                      {post.isAi && <div className={`absolute -bottom-1 -right-1 bg-${primaryColor}-600 text-[8px] text-white px-1 rounded font-bold`}>AI</div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                          <div className="flex flex-col md:flex-row md:items-center gap-1">
                                              <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-1">{post.authorName} {post.isAi && <ShieldCheck className="w-4 h-4 text-blue-500" />}</h4>
                                              <span className="text-slate-500 text-sm">@{post.authorId} · {Math.floor((Date.now() - post.timestamp) / 60000)}m</span>
                                          </div>
                                          <button className="text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 p-2 rounded-full transition"><MoreHorizontal size={18} /></button>
                                      </div>
                                      
                                      <div className="text-slate-900 dark:text-slate-100 text-base mb-3 whitespace-pre-wrap leading-relaxed mt-1">{post.content}</div>
                                      
                                      {post.images && post.images.length > 0 && (
                                          <div className="mb-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                              <img src={post.images[0]} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
                                          </div>
                                      )}

                                      <ReactionBar post={post} />
                                      
                                      {/* Comments Preview */}
                                      {post.comments.length > 0 && (
                                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                {post.comments.slice(0, 2).map(comment => (
                                                    <div key={comment.id} className="flex gap-2 text-sm mb-2">
                                                        <img src={comment.userAvatar} className="w-6 h-6 rounded-full mt-1" />
                                                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 flex-1">
                                                            <span className="font-bold text-slate-900 dark:text-white mr-2">{comment.userName}</span>
                                                            <span className="text-slate-700 dark:text-slate-300">{comment.text}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                          </div>
                                      )}
                                      
                                      {/* Comment Input */}
                                      <div className="flex gap-3 items-center mt-3">
                                          <img src={CURRENT_USER.photos[0]} className="w-8 h-8 rounded-full" />
                                          <div className="flex-1 relative">
                                              <input 
                                                value={commentInputs[post.id] || ''} 
                                                onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })} 
                                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(post.id)} 
                                                className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm outline-none pr-10 focus:ring-1 focus:ring-${primaryColor}-500 transition`} 
                                                placeholder={t.write_comment} 
                                              />
                                              <button onClick={() => handleSubmitComment(post.id)} className={`absolute right-2 top-1.5 text-${primaryColor}-500 hover:bg-${primaryColor}-100 dark:hover:bg-${primaryColor}-900/30 p-1 rounded-full`}><Send size={16} /></button>
                                          </div>
                                      </div>
                                </div>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
  );

  const renderRightSidebar = () => (
      <div className="hidden md:flex w-[300px] flex-col border-l border-slate-200 dark:border-slate-800 h-full fixed right-0 top-0 bottom-0 bg-white dark:bg-slate-900 z-10 p-4 overflow-y-auto">
           {/* Search Box */}
           <div className="relative mb-6 group">
                <Search className={`absolute left-4 top-3 text-slate-400 w-5 h-5 group-focus-within:text-${primaryColor}-500 transition`}/>
                <input 
                    placeholder={t.search_topics} 
                    className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-${primaryColor}-500 focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-${primaryColor}-500 transition text-sm`}
                />
           </div>

           {/* Trending */}
           <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
               <h3 className="font-bold text-xl px-4 py-3 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">{t.trending_title}</h3>
               {TRENDING_TAGS.map((tag, i) => (
                   <div key={i} className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer">
                       <div className="text-xs text-slate-500 flex justify-between">
                           <span>Trending in Vietnam</span>
                           <MoreHorizontal size={14} />
                       </div>
                       <div className="font-bold text-slate-900 dark:text-white mt-0.5">{tag.tag}</div>
                       <div className="text-xs text-slate-500 mt-0.5">{tag.posts} {t.trending_posts}</div>
                   </div>
               ))}
               <div className={`px-4 py-3 text-${primaryColor}-500 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700`}>Show more</div>
           </div>
           
           {/* Footer */}
           <div className="mt-6 text-xs text-slate-400 leading-5 px-2">
               <span>Terms of Service</span> · <span>Privacy Policy</span> · <span>Cookie Policy</span> · <span>Accessibility</span> · <span>Ads Info</span> · <span>© 2024 SoulSync Inc.</span>
           </div>
      </div>
  );

  if (viewMode === 'explore') return renderExplore();

  return (
    <div className="h-full flex bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
      {/* Left Sidebar (Icons) */}
      <div className="absolute left-0 top-0 bottom-0 w-[60px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-4 z-20 space-y-4">
          <button onClick={() => setViewMode('explore')} className={`w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-${primaryColor}-600 hover:bg-${primaryColor}-50 dark:hover:bg-${primaryColor}-900/30 flex items-center justify-center transition`}><Hash size={24} /></button>
          <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar w-full items-center">
              {followedTopics.map(topic => {
                  const cat = COMMUNITY_CATEGORIES.find(c => c.id === topic.categoryId);
                  const Icon = cat ? (ICONS[cat.iconName] || Hash) : Hash;
                  return (
                      <button key={topic.id} onClick={() => { setSelectedTopicId(topic.id); setViewMode('feed'); }} className={`w-10 h-10 rounded-full flex items-center justify-center transition relative group ${selectedTopicId === topic.id ? `bg-slate-200 dark:bg-slate-800 border-2 border-${primaryColor}-500 text-${primaryColor}-500` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title={topic.title}><Icon size={20} /><div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50 shadow-xl">{topic.title}</div></button>
                  )
              })}
          </div>
          <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
           <button onClick={() => setViewMode('explore')} className={`w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 text-slate-400 hover:border-${primaryColor}-500 hover:text-${primaryColor}-500 flex items-center justify-center transition`}><Plus size={20} /></button>
      </div>

      {renderFeed()}
      {renderRightSidebar()}
    </div>
  );
};
