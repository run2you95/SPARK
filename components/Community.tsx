
import React, { useEffect, useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { CommunityTopic, SocialPost, ReactionType } from '../types';
import { CURRENT_USER, INITIAL_TOPICS, MOCK_POSTS, TRANSLATIONS } from '../constants';
import { MessageCircle, Heart, Share2, Loader2, Send, Lock, ShieldCheck, Hash, Menu, ThumbsUp, Laugh, Frown, Angry, Smile, MoreHorizontal, Plus, Check, Globe } from 'lucide-react';

export const Community: React.FC<{ language: 'vi' | 'en' }> = ({ language }) => {
  const [topics, setTopics] = useState<CommunityTopic[]>(INITIAL_TOPICS);
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_POSTS);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'feed' | 'explore'>('feed'); 

  const t = TRANSLATIONS[language];
  const followedTopics = topics.filter(t => t.isFollowed);
  const activeTopic = topics.find(t => t.id === selectedTopicId);
  
  useEffect(() => {
    if (followedTopics.length > 0 && !selectedTopicId) {
        setSelectedTopicId(followedTopics[0].id);
    } else if (followedTopics.length === 0 && viewMode === 'feed') {
        setViewMode('explore'); 
    }
  }, [topics]);

  // Load topics in correct language on mount or language change
  useEffect(() => {
      const fetchTopics = async () => {
          const aiTopics = await GeminiService.generateCommunityTopics(language);
          if (aiTopics.length > 0) {
             // Merge with existing logic if needed, for now just replace mocks if AI succeeds to show language support
             // In a real app we'd likely just translate the UI around the content
             // setTopics(aiTopics); 
          }
      }
      fetchTopics();
  }, [language]);

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

  const ReactionBar = ({ post }: { post: SocialPost }) => {
      const reactionIcons: Record<ReactionType, { icon: React.ReactNode, color: string, label: string }> = {
          like: { icon: <ThumbsUp size={16} />, color: 'text-blue-500', label: 'Like' },
          love: { icon: <Heart size={16} />, color: 'text-red-500', label: 'Love' },
          haha: { icon: <Laugh size={16} />, color: 'text-yellow-500', label: 'Haha' },
          wow: { icon: <Smile size={16} />, color: 'text-yellow-500', label: 'Wow' },
          sad: { icon: <Frown size={16} />, color: 'text-yellow-500', label: 'Sad' },
          angry: { icon: <Angry size={16} />, color: 'text-orange-500', label: 'Angry' }
      };

      const myReaction = post.userReaction ? reactionIcons[post.userReaction] : null;

      return (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 mt-2 relative group">
              <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition ${myReaction ? myReaction.color : 'text-slate-500 dark:text-slate-400'}`}>
                  {myReaction ? myReaction.icon : <ThumbsUp size={18} />}
                  <span className="text-sm font-medium">{myReaction ? myReaction.label : 'Like'}</span>
              </button>
              
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">Comment</span>
              </button>
              
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
                  <Share2 size={18} />
                  <span className="text-sm font-medium">Share</span>
              </button>

              <div className="absolute bottom-12 left-4 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-600 p-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                   {(Object.keys(reactionIcons) as ReactionType[]).map(type => (
                       <button 
                        key={type}
                        onClick={() => handleReaction(post.id, type)}
                        className="p-2 hover:scale-125 transition-transform bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                       >
                           {reactionIcons[type].icon}
                       </button>
                   ))}
              </div>
          </div>
      );
  };

  const renderExplore = () => (
      <div className="p-4 h-full overflow-y-auto pb-24 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.explore_topics}</h2>
              <button onClick={() => setViewMode('feed')} className="text-sm text-pink-600 font-bold hover:underline">{t.back_to_feed}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map(topic => (
                  <div key={topic.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{topic.title}</h3>
                            <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full">#{topic.tags[0]}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{topic.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                            <span>{topic.followers.toLocaleString()} followers</span>
                            <span>{topic.likes} likes</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleFollow(topic.id)}
                        className={`mt-4 w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition ${
                            topic.isFollowed 
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' 
                            : 'bg-pink-600 text-white hover:bg-pink-500'
                        }`}
                      >
                          {topic.isFollowed ? <><Check size={16}/> {t.followed}</> : <><Plus size={16}/> {t.follow}</>}
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderFeed = () => (
      <div className="flex-1 flex flex-col h-full w-full relative">
          {/* Header */}
          <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur z-10 sticky top-0">
             <div className="flex items-center gap-3">
                  <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-slate-500"><Menu/></button>
                  {activeTopic ? (
                      <div>
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {activeTopic.title}
                          </h3>
                      </div>
                  ) : <div className="font-bold text-slate-500">Select Topic</div>}
             </div>
             <button onClick={() => setViewMode('explore')} className="text-xs font-bold text-pink-600 border border-pink-600 px-3 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20">
                 + {t.add_topic}
             </button>
          </div>

          {/* Posts Feed */}
          <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-black p-0 md:p-4 pb-20 space-y-4">
              {posts.filter(p => !activeTopic || p.topicId === activeTopic.id).length === 0 ? (
                  <div className="text-center py-10 text-slate-500">{t.no_posts}</div>
              ) : (
                  posts.filter(p => !activeTopic || p.topicId === activeTopic.id).map(post => (
                      <div key={post.id} className="bg-white dark:bg-slate-800 md:rounded-xl p-4 shadow-sm border-b md:border border-slate-200 dark:border-slate-700">
                          {/* Post Header */}
                          <div className="flex justify-between items-start mb-3">
                              <div className="flex gap-3">
                                  <div className="relative">
                                      <img src={post.authorAvatar} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600" alt="avt" />
                                      {post.isAi && <div className="absolute -bottom-1 -right-1 bg-pink-600 text-[8px] text-white px-1 rounded font-bold">AI</div>}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                                          {post.authorName}
                                          {post.isAi && <ShieldCheck className="w-3 h-3 text-blue-500" />}
                                      </h4>
                                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                          <span>{Math.floor((Date.now() - post.timestamp) / 60000)}m ago</span>
                                          <span>•</span>
                                          <Globe size={10} />
                                      </div>
                                  </div>
                              </div>
                              <button className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 p-1 rounded-full"><MoreHorizontal size={20} /></button>
                          </div>

                          {/* Content */}
                          <div className="text-slate-800 dark:text-slate-200 text-sm mb-3 whitespace-pre-wrap leading-relaxed">
                              {post.content}
                          </div>
                          {post.images && post.images.length > 0 && (
                              <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                  <img src={post.images[0]} alt="Post content" className="w-full h-auto max-h-96 object-cover" />
                              </div>
                          )}

                          {/* Stats */}
                          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
                               <div className="flex items-center gap-1">
                                   <div className="flex -space-x-1">
                                       <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white dark:border-slate-800"><ThumbsUp size={10} className="text-white"/></div>
                                       <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-white dark:border-slate-800"><Heart size={10} className="text-white"/></div>
                                   </div>
                                   <span>{Object.values(post.reactions).reduce((a: number, b: number) => a + b, 0)}</span>
                               </div>
                               <div className="flex gap-3">
                                   <span>{post.comments.length} comments</span>
                                   <span>0 shares</span>
                               </div>
                          </div>

                          {/* Action Bar */}
                          <ReactionBar post={post} />

                          {/* Comments Preview */}
                          {post.comments.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                  {post.comments.slice(0, 2).map(comment => (
                                      <div key={comment.id} className="flex gap-2 mb-2 text-sm">
                                          <img src={comment.userAvatar} className="w-6 h-6 rounded-full" />
                                          <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl px-3 py-1.5">
                                              <span className="font-bold text-slate-900 dark:text-white mr-2 text-xs">{comment.userName}</span>
                                              <span className="text-slate-700 dark:text-slate-300 text-xs">{comment.text}</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                          <div className="mt-2 flex gap-2">
                             <img src={CURRENT_USER.photos[0]} className="w-6 h-6 rounded-full" />
                             <input className="bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1 text-xs flex-1 outline-none" placeholder={t.write_comment} />
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
  );

  if (viewMode === 'explore') return renderExplore();

  return (
    <div className="h-full flex bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
      
      {/* Sidebar: Followed Topics */}
      <div className={`
        absolute md:relative z-40 w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300
        ${showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
          <div className="p-4 pt-16 md:pt-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 {t.followed_topics}
              </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {followedTopics.length === 0 ? (
                  <div className="p-4 text-center">
                      <p className="text-sm text-slate-500 mb-4">{t.explore_topics} to get started.</p>
                      <button onClick={() => setViewMode('explore')} className="text-pink-600 font-bold text-sm">Explore</button>
                  </div>
              ) : (
                  followedTopics.map(topic => (
                      <button
                          key={topic.id}
                          onClick={() => {
                              setSelectedTopicId(topic.id);
                              setShowMobileMenu(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-all flex flex-col gap-1 ${
                              selectedTopicId === topic.id 
                                ? 'bg-pink-50 dark:bg-slate-800 border-l-4 border-pink-500' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                      >
                          <div className={`font-semibold text-sm truncate ${selectedTopicId === topic.id ? 'text-pink-600 dark:text-white' : ''}`}>{topic.title}</div>
                      </button>
                  ))
              )}
          </div>
          
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <button onClick={() => setViewMode('explore')} className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm font-bold text-slate-600 dark:text-slate-300">
                 {t.explore_topics}
             </button>
          </div>
      </div>

      {/* Main Feed */}
      {renderFeed()}
      
      {/* Mobile Overlay */}
      {showMobileMenu && <div className="absolute inset-0 bg-black/50 z-30 md:hidden" onClick={() => setShowMobileMenu(false)}></div>}
    </div>
  );
};
