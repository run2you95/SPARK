
import { MatchCandidate, UserGender, UserProfile, SocialPost, CommunityTopic } from './types';

export const CHAT_BACKGROUNDS = [
  { id: 'default', value: 'bg-slate-900', name: 'Default Dark' },
  { id: 'light', value: 'bg-slate-100', name: 'Default Light' },
  { id: 'gradient-pink', value: 'bg-gradient-to-br from-pink-900 to-slate-900', name: 'Pink Aura' },
  { id: 'gradient-blue', value: 'bg-gradient-to-br from-blue-900 to-slate-900', name: 'Deep Ocean' },
  { id: 'stars', value: 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")] bg-slate-900', name: 'Stardust' },
  { id: 'paper', value: 'bg-[url("https://www.transparenttextures.com/patterns/cream-paper.png")] bg-stone-100', name: 'Paper' },
];

export const TRANSLATIONS = {
  vi: {
    app_name: 'SoulSync',
    tab_community: 'Cộng đồng',
    tab_groups: 'Hội nhóm',
    tab_matching: 'Ghép đôi',
    tab_chat: 'Trò chuyện',
    tab_profile: 'Cá nhân',
    
    // Matching
    match_title: 'Ghép Đôi',
    group_title: 'Ghép Nhóm',
    ai_suggestion: 'AI Đề xuất',
    analyzing: 'AI đang tìm địa điểm...',
    match_percentage: 'Hợp',
    distance: 'km',
    its_a_match: "IT'S A MATCH!",
    match_common: 'điểm chung',
    btn_chat_now: 'Nhắn tin ngay',
    btn_keep_swiping: 'Lướt tiếp',
    out_of_candidates: 'Hết lượt gợi ý!',
    come_back_later: 'Hãy quay lại sau hoặc mở rộng phạm vi.',
    
    // Chat
    chat_input_placeholder: 'Nhập tin nhắn...',
    chat_who_pays: 'Ai trả tiền?',
    chat_suggest_location: 'Gợi ý địa điểm',
    chat_send_photo: 'Gửi ảnh',
    chat_online: 'Đang hoạt động',
    chat_settings: 'Cài đặt Chat',
    chat_bg_title: 'Phông nền',
    location_searching: 'Đang tìm địa điểm phù hợp...',
    location_found: 'Điểm hẹn gợi ý',
    open_maps: 'Mở Google Maps',

    // Profile
    profile_bio: 'GIỚI THIỆU',
    profile_save: 'Lưu thay đổi',
    profile_settings: 'Cài đặt ứng dụng',
    profile_theme: 'Giao diện',
    profile_language: 'Ngôn ngữ',
    profile_accounts: 'Tài khoản liên kết',
    profile_payment: 'Thanh toán',
    profile_logout: 'Đăng xuất',
    connected: 'Đã kết nối',
    not_connected: 'Chưa kết nối',
    wallet_balance: 'Ví SoulSync',
    connect_spotify_msg: 'Kết nối Spotify để hiển thị bài hát yêu thích.',
    connect_btn: 'Kết nối ngay',
    
    // Community
    explore_topics: 'Khám phá chủ đề',
    followed_topics: 'Chủ đề đã theo dõi',
    back_to_feed: 'Quay lại Newsfeed',
    add_topic: 'Thêm chủ đề',
    follow: 'Quan tâm',
    followed: 'Đã quan tâm',
    no_posts: 'Chưa có bài viết nào.',
    write_comment: 'Viết bình luận...',
  },
  en: {
    app_name: 'SoulSync',
    tab_community: 'Community',
    tab_groups: 'Groups',
    tab_matching: 'Matching',
    tab_chat: 'Chat',
    tab_profile: 'Profile',
    
    // Matching
    match_title: 'Matching',
    group_title: 'Group Match',
    ai_suggestion: 'AI Suggestion',
    analyzing: 'AI is finding a spot...',
    match_percentage: 'Match',
    distance: 'km',
    its_a_match: "IT'S A MATCH!",
    match_common: 'common interests',
    btn_chat_now: 'Chat Now',
    btn_keep_swiping: 'Keep Swiping',
    out_of_candidates: 'No more profiles!',
    come_back_later: 'Check back later or expand your range.',

    // Chat
    chat_input_placeholder: 'Type a message...',
    chat_who_pays: 'Who pays?',
    chat_suggest_location: 'Suggest Spot',
    chat_send_photo: 'Send Photo',
    chat_online: 'Active Now',
    chat_settings: 'Chat Settings',
    chat_bg_title: 'Wallpaper',
    location_searching: 'Finding perfect spot...',
    location_found: 'Suggested Spot',
    open_maps: 'Open Maps',

    // Profile
    profile_bio: 'BIO',
    profile_save: 'Save Changes',
    profile_settings: 'App Settings',
    profile_theme: 'Theme',
    profile_language: 'Language',
    profile_accounts: 'Connected Accounts',
    profile_payment: 'Payment',
    profile_logout: 'Log Out',
    connected: 'Connected',
    not_connected: 'Connect',
    wallet_balance: 'SoulSync Wallet',
    connect_spotify_msg: 'Connect Spotify to show your top jams on your profile.',
    connect_btn: 'Connect Now',

    // Community
    explore_topics: 'Explore Topics',
    followed_topics: 'Followed Topics',
    back_to_feed: 'Back to Feed',
    add_topic: 'Add Topic',
    follow: 'Follow',
    followed: 'Following',
    no_posts: 'No posts yet.',
    write_comment: 'Write a comment...',
  }
};

export const CURRENT_USER: UserProfile = {
  id: 'me',
  name: 'Nguyễn Văn A',
  email: 'nguyen.vana@gmail.com',
  age: 26,
  gender: UserGender.Male,
  location: 'Ho Chi Minh City',
  bio: 'Technology enthusiast, coffee lover, and adventure seeker.',
  interests: ['Coding', 'Coffee', 'Travel', 'Photography', 'AI'],
  photos: ['https://picsum.photos/400/400?random=100'],
  isVerified: false, 
  socials: {
    google: 'not_connected',
    spotify: 'not_connected', // Default to not connected
    instagram: 'connected'
  },
  settings: {
    theme: 'dark',
    language: 'vi',
    notifications: true,
    chatBackground: 'bg-slate-900'
  },
  spotifyTopTracks: [], // Empty default
  instagramPosts: [
    { id: 'p1', imageUrl: 'https://picsum.photos/150/150?random=301', caption: 'Da Lat Trip 🌲', likes: 120 },
    { id: 'p2', imageUrl: 'https://picsum.photos/150/150?random=302', caption: 'Coffee time ☕️', likes: 85 },
    { id: 'p3', imageUrl: 'https://picsum.photos/150/150?random=303', caption: 'Sunset 🌅', likes: 210 }
  ],
  paymentMethods: [
    { id: 'card1', type: 'visa', last4: '4242', expiry: '12/25' },
    { id: 'momo', type: 'momo', last4: '0909', expiry: '' }
  ]
};

export const MOCK_CANDIDATES: MatchCandidate[] = [
  {
    id: 'c1',
    name: 'Emily Chen',
    age: 24,
    gender: UserGender.Female,
    location: 'District 1, HCMC',
    bio: 'Expat living in Saigon. Love street food and architecture.',
    interests: ['Design', 'Street Food', 'Architecture', 'Travel'],
    photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'],
    matchPercentage: 88,
    distanceKm: 2.1,
    socials: { instagram: 'connected' }
  },
  {
    id: 'c2',
    name: 'Trần Minh Tuấn',
    age: 28,
    gender: UserGender.Male,
    location: 'District 3, HCMC',
    bio: 'Startup founder. Looking for someone to share ideas with.',
    interests: ['Startup', 'Running', 'Tech', 'Coffee'],
    photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'],
    matchPercentage: 75,
    distanceKm: 4.5,
    socials: { google: 'connected' }
  },
  {
    id: 'c3',
    name: 'Sophia Williams',
    age: 25,
    gender: UserGender.Female,
    location: 'Thao Dien, Thu Duc',
    bio: 'Yoga teacher. Love nature and sustainable living.',
    interests: ['Yoga', 'Nature', 'Vegan', 'Reading'],
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80'],
    matchPercentage: 92,
    distanceKm: 8.0,
    socials: { spotify: 'connected' }
  },
  {
    id: 'c4',
    name: 'Hoàng Lan',
    age: 23,
    gender: UserGender.Female,
    location: 'Binh Thanh District',
    bio: 'Art student. I paint and listen to jazz.',
    interests: ['Art', 'Jazz', 'Painting', 'Cats'],
    photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'],
    matchPercentage: 81,
    distanceKm: 3.2,
    socials: {}
  },
  {
    id: 'c5',
    name: 'David Nguyen',
    age: 29,
    gender: UserGender.Male,
    location: 'District 7',
    bio: 'Financial analyst by day, gamer by night.',
    interests: ['Finance', 'Gaming', 'Gym', 'Investments'],
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'],
    matchPercentage: 68,
    distanceKm: 10.5,
    socials: { facebook: 'connected' }
  }
];

export const MOCK_GROUPS: MatchCandidate[] = [
  {
    id: 'g1',
    name: 'Saigon Boardgames',
    age: 2023, 
    gender: UserGender.Other,
    location: 'District 10',
    bio: 'Weekly boardgame meetups. Beginners welcome!',
    interests: ['Boardgames', 'Strategy', 'Fun', 'Beer'],
    photos: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'],
    matchPercentage: 88,
    distanceKm: 4,
    socials: { facebook: 'connected' }
  },
  {
    id: 'g2',
    name: 'Film Photography VN',
    age: 2021,
    gender: UserGender.Other,
    location: 'Sài Gòn',
    bio: 'For the love of analog photography.',
    interests: ['Photography', 'Art', 'Travel', 'Vintage'],
    photos: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
    matchPercentage: 95,
    distanceKm: 2,
    socials: { instagram: 'connected' }
  },
  {
    id: 'g3',
    name: 'English Speaking Club',
    age: 2019,
    gender: UserGender.Other,
    location: 'District 1',
    bio: 'Practice English and make new friends.',
    interests: ['Languages', 'Culture', 'Networking'],
    photos: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'],
    matchPercentage: 90,
    distanceKm: 1.5,
    socials: {}
  }
];

export const INITIAL_TOPICS: CommunityTopic[] = [
    { id: 't1', title: 'Tư vấn hẹn hò', description: 'Góc chia sẻ kinh nghiệm tình trường.', likes: 120, followers: 5400, tags: ['Dating', 'Advice'], isFollowed: true },
    { id: 't2', title: 'Góc Cảnh Giác', description: 'Những red flags cần tránh khi yêu.', likes: 340, followers: 8200, tags: ['Warning', 'RedFlags'], isFollowed: false },
    { id: 't3', title: 'Địa điểm Hot', description: 'Review các quán cafe, địa điểm hẹn hò xịn.', likes: 89, followers: 3100, tags: ['Place', 'Review'], isFollowed: true },
    { id: 't4', title: 'Confession Thầm Kín', description: 'Nơi trút bầu tâm sự ẩn danh.', likes: 500, followers: 12000, tags: ['Drama', 'Confession'], isFollowed: false },
    { id: 't5', title: 'Tech & Love', description: 'Dân IT yêu như thế nào?', likes: 200, followers: 1500, tags: ['Tech', 'Love'], isFollowed: false }
];

export const MOCK_POSTS: SocialPost[] = [
    {
        id: 'post1',
        topicId: 't1',
        authorId: 'ai_bot',
        authorName: 'Tư Vấn Tình Yêu (AI)',
        authorAvatar: 'https://ui-avatars.com/api/?name=AI&background=db2777&color=fff',
        isAi: true,
        content: '🚩 5 signs that your partner might be "gaslighting" you.\n\n1. They deny your memory of events.\n2. They blame you for their emotions.\n...\nHave you experienced this? Share below! 👇',
        timestamp: Date.now() - 3600000,
        reactions: { like: 45, love: 12, haha: 0, wow: 5, sad: 20, angry: 2 },
        comments: [
            { id: 'c1', userId: 'u2', userName: 'Minh Tuấn', userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=40&q=80', text: 'Scary, happened to me once.', timestamp: Date.now() - 1800000, likes: 5 }
        ]
    },
    {
        id: 'post2',
        topicId: 't3',
        authorId: 'u3',
        authorName: 'Sarah Nguyễn',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=40&q=80',
        content: 'Found this amazing rooftop bar with a view of Landmark 81! 🌃🍸 \nDrinks are around 80k-120k, chill acoustic music.',
        images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'],
        timestamp: Date.now() - 7200000,
        reactions: { like: 120, love: 50, haha: 0, wow: 10, sad: 0, angry: 0 },
        comments: []
    },
    {
        id: 'post3',
        topicId: 't5',
        authorId: 'u4',
        authorName: 'Dev Guy',
        authorAvatar: 'https://ui-avatars.com/api/?name=Dev&background=0f172a&color=fff',
        content: 'My girlfriend said I love my mechanical keyboard more than her. I told her that\'s a syntax error. Now I\'m sleeping on the couch. Help? ⌨️🛋️',
        timestamp: Date.now() - 10000000,
        reactions: { like: 20, love: 0, haha: 300, wow: 2, sad: 5, angry: 0 },
        comments: [
            { id: 'c2', userId: 'u5', userName: 'Coder Girl', userAvatar: 'https://ui-avatars.com/api/?name=CG&background=ec4899&color=fff', text: 'Refactor your priorities bro.', timestamp: Date.now() - 9000000, likes: 45 }
        ]
    }
];
