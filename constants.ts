

import { MatchCandidate, UserGender, UserProfile, SocialPost, CommunityTopic, CommunityCategory, Conversation, CategoryId } from './types';

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
    analyzing: 'Đang tìm điểm hẹn...',
    wait_for_ai: 'AI đang phân tích...',
    match_percentage: 'Hợp',
    distance: 'km',
    its_a_match: "IT'S A MATCH!",
    match_common: 'điểm chung',
    btn_chat_now: 'Nhắn tin ngay',
    btn_keep_swiping: 'Lướt tiếp',
    out_of_candidates: 'Hết lượt gợi ý!',
    come_back_later: 'Hãy quay lại sau hoặc mở rộng phạm vi.',
    filters_title: 'Bộ lọc tìm kiếm',
    filter_age: 'Độ tuổi',
    filter_dist: 'Khoảng cách tối đa',
    filter_time: 'Thời gian gặp',
    filter_community: 'Cộng đồng',
    apply_filters: 'Áp dụng',
    
    // Filters
    time_any: 'Bất kỳ lúc nào',
    time_asap: 'Ngay bây giờ (2h)',
    time_tonight: 'Tối nay',
    time_weekend: 'Cuối tuần này',
    comm_all: 'Tất cả',

    // Chat
    chat_new_matches: 'Tương hợp mới',
    chat_messages: 'Tin nhắn',
    chat_input_placeholder: 'Nhập tin nhắn...',
    chat_who_pays: 'Thanh toán',
    chat_suggest_location: 'Gợi ý lại',
    chat_change_time: 'Đổi giờ',
    chat_online: 'Đang hoạt động',
    chat_settings: 'Cài đặt Chat',
    chat_bg_title: 'Phông nền',
    location_searching: 'Đang tìm địa điểm mới...',
    location_found: 'Đã tìm thấy:',
    open_maps: 'Mở Google Maps',
    payer_me: 'Tôi trả',
    payer_split: 'Chia đôi',
    payer_them: 'Bạn trả',
    payer_random: 'Ngẫu nhiên',
    
    // Messages System
    msg_hello: 'Chào đằng ấy! 👋',
    msg_intro: 'Thấy profile bạn thú vị quá, mình làm quen nhé?',
    sys_ai_plan_ready: 'AI đã chuẩn bị sẵn kế hoạch hẹn hò tại',
    sys_check_sidebar: 'Kiểm tra cột bên trái nhé! 👇',
    prompt_new_time: 'Nhập thời gian hẹn mới:',

    // Location
    loc_permission_title: 'Cần quyền vị trí',
    loc_permission_desc: 'SoulSync cần biết vị trí của bạn để AI gợi ý điểm hẹn hò hoàn hảo ở giữa bạn và đối phương.',
    grant_permission: 'Chia sẻ vị trí',

    // Profile
    profile_wall: 'TƯỜNG',
    profile_info: 'THÔNG TIN',
    profile_bio: 'Giới thiệu',
    profile_job: 'Công việc',
    profile_bday: 'Ngày sinh',
    profile_interests: 'Sở thích',
    add_interest: 'Thêm',
    type_interest: 'Nhập sở thích...',
    profile_save: 'Lưu thay đổi',
    profile_settings: 'Cài đặt',
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
    edit: 'Sửa',
    save: 'Lưu',
    cancel: 'Hủy',
    enter_link: 'Nhập liên kết hoặc ID',
    link_placeholder: 'https://...',
    alert_google: 'Đã kết nối thành công với Google!',
    alert_spotify: 'Đã kết nối Spotify!',
    
    // Community
    explore_topics: 'Khám phá',
    search_topics: 'Tìm kiếm chủ đề...',
    followed_topics: 'Đã theo dõi',
    back_to_feed: 'Quay lại',
    add_topic: 'Thêm chủ đề',
    follow: 'Quan tâm',
    followed: 'Đã quan tâm',
    no_posts: 'Chưa có bài viết nào.',
    write_comment: 'Viết bình luận...',
    trending_title: 'Xu hướng hôm nay',
    trending_posts: 'bài viết',
    category_love: 'Tình yêu & Hẹn hò',
    category_sports: 'Thể thao & Vận động',
    category_tech: 'Công nghệ & Game',
    category_lifestyle: 'Phong cách sống',
    category_arts: 'Nghệ thuật & Nhạc',
    category_food: 'Ẩm thực & Đi chơi',
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
    analyzing: 'Finding spot...',
    wait_for_ai: 'Analyzing...',
    match_percentage: 'Match',
    distance: 'km',
    its_a_match: "IT'S A MATCH!",
    match_common: 'common interests',
    btn_chat_now: 'Chat Now',
    btn_keep_swiping: 'Keep Swiping',
    out_of_candidates: 'No more profiles!',
    come_back_later: 'Check back later or expand your range.',
    filters_title: 'Discovery Filters',
    filter_age: 'Age Range',
    filter_dist: 'Max Distance',
    filter_time: 'Meeting Time',
    filter_community: 'Community',
    apply_filters: 'Apply Filters',

    // Filters
    time_any: 'Any Time',
    time_asap: 'ASAP (Within 2h)',
    time_tonight: 'Tonight',
    time_weekend: 'This Weekend',
    comm_all: 'All',

    // Chat
    chat_new_matches: 'New Matches',
    chat_messages: 'Messages',
    chat_input_placeholder: 'Type a message...',
    chat_who_pays: 'Who pays',
    chat_suggest_location: 'New Spot',
    chat_change_time: 'Change Time',
    chat_online: 'Active Now',
    chat_settings: 'Chat Settings',
    chat_bg_title: 'Wallpaper',
    location_searching: 'Finding new spot...',
    location_found: 'Found:',
    open_maps: 'Open Maps',
    payer_me: 'I Pay',
    payer_split: 'Split',
    payer_them: 'You Pay',
    payer_random: 'Random',

    // Messages System
    msg_hello: 'Hey there! 👋',
    msg_intro: 'Loved your profile, want to chat?',
    sys_ai_plan_ready: 'AI has a date plan ready at',
    sys_check_sidebar: 'Check the sidebar! 👇',
    prompt_new_time: 'Enter new meeting time:',

    // Location
    loc_permission_title: 'Location Required',
    loc_permission_desc: 'SoulSync needs your location so our AI can find the perfect meeting spots between you and your match.',
    grant_permission: 'Share Location',

    // Profile
    profile_wall: 'WALL',
    profile_info: 'INFO',
    profile_bio: 'Bio',
    profile_job: 'Job Title',
    profile_bday: 'Birthday',
    profile_interests: 'Interests',
    add_interest: 'Add',
    type_interest: 'Type interest...',
    profile_save: 'Save Changes',
    profile_settings: 'Settings',
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
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    enter_link: 'Enter link or handle',
    link_placeholder: 'https://...',
    alert_google: 'Successfully connected with Google!',
    alert_spotify: 'Spotify Connected!',

    // Community
    explore_topics: 'Explore',
    search_topics: 'Search topics...',
    followed_topics: 'Following',
    back_to_feed: 'Back',
    add_topic: 'Add Topic',
    follow: 'Follow',
    followed: 'Following',
    no_posts: 'No posts yet.',
    write_comment: 'Write a comment...',
    trending_title: 'What\'s Happening',
    trending_posts: 'posts',
    category_love: 'Love & Dating',
    category_sports: 'Sports & Active',
    category_tech: 'Tech & Gaming',
    category_lifestyle: 'Lifestyle',
    category_arts: 'Arts & Music',
    category_food: 'Food & Hangout',
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
  job: 'Software Engineer',
  birthday: '12/05/1998',
  interests: ['Coding', 'Coffee', 'Travel', 'Photography', 'AI'],
  photos: ['https://picsum.photos/400/400?random=100'],
  isVerified: false, 
  socials: {
    google: 'not_connected',
    spotify: 'not_connected',
    instagram: 'connected'
  },
  settings: {
    theme: 'dark',
    language: 'vi',
    notifications: true,
    chatBackground: 'bg-slate-900'
  },
  spotifyTopTracks: [],
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

export const COMMUNITY_CATEGORIES: CommunityCategory[] = [
    { id: 'love', name: 'category_love', iconName: 'Heart' },
    { id: 'sports', name: 'category_sports', iconName: 'Dumbbell' },
    { id: 'tech', name: 'category_tech', iconName: 'Cpu' },
    { id: 'lifestyle', name: 'category_lifestyle', iconName: 'Coffee' },
    { id: 'arts', name: 'category_arts', iconName: 'Palette' },
    { id: 'food', name: 'category_food', iconName: 'Utensils' },
];

export const getInitialTopics = (lang: 'vi'|'en'): CommunityTopic[] => {
    const isVi = lang === 'vi';
    const baseTopics: CommunityTopic[] = [
        { id: 't1', categoryId: 'love', title: isVi ? 'Tư vấn hẹn hò' : 'Dating Advice', description: isVi ? 'Góc chia sẻ kinh nghiệm tình trường.' : 'Sharing dating experiences.', likes: 120, followers: 5400, tags: ['Dating', 'Advice'], isFollowed: true },
        { id: 't2', categoryId: 'love', title: isVi ? 'Góc Cảnh Giác' : 'Red Flags', description: isVi ? 'Những red flags cần tránh khi yêu.' : 'Red flags to avoid in dating.', likes: 340, followers: 8200, tags: ['Warning', 'RedFlags'], isFollowed: false },
        { id: 't3', categoryId: 'food', title: isVi ? 'Địa điểm Hot' : 'Hot Spots', description: isVi ? 'Review các quán cafe, địa điểm hẹn hò xịn.' : 'Reviews of cafes and dating spots.', likes: 89, followers: 3100, tags: ['Place', 'Review'], isFollowed: true },
        { id: 't4', categoryId: 'love', title: isVi ? 'Confession Thầm Kín' : 'Secret Confessions', description: isVi ? 'Nơi trút bầu tâm sự ẩn danh.' : 'Anonymous confessions.', likes: 500, followers: 12000, tags: ['Drama', 'Confession'], isFollowed: false },
        { id: 't5', categoryId: 'tech', title: isVi ? 'Tech & Love' : 'Tech & Love', description: isVi ? 'Dân IT yêu như thế nào?' : 'How IT people date?', likes: 200, followers: 1500, tags: ['Tech', 'Love'], isFollowed: false },
        { id: 't6', categoryId: 'sports', title: isVi ? 'Bóng đá Ngoại hạng' : 'Premier League', description: isVi ? 'Bàn luận về EPL và C1.' : 'Discussing EPL and Champions League.', likes: 600, followers: 5000, tags: ['Football', 'Sports'], isFollowed: false },
        { id: 't7', categoryId: 'arts', title: isVi ? 'Indie Music VN' : 'Indie Music', description: isVi ? 'Cộng đồng yêu nhạc Indie Việt.' : 'Community for Indie music lovers.', likes: 150, followers: 2300, tags: ['Music', 'Indie'], isFollowed: true },
        { id: 't8', categoryId: 'tech', title: isVi ? 'Crypto & Blockchain' : 'Crypto & Blockchain', description: isVi ? 'Bitcoin, ETH và tương lai.' : 'Bitcoin, ETH and the future.', likes: 900, followers: 8900, tags: ['Crypto', 'Money'], isFollowed: false },
        { id: 't9', categoryId: 'lifestyle', title: isVi ? 'GenZ Slang' : 'GenZ Slang', description: isVi ? 'Học tiếng lóng giới trẻ.' : 'Learning Gen Z slang.', likes: 450, followers: 6700, tags: ['GenZ', 'Humor'], isFollowed: true },
        { id: 't10', categoryId: 'tech', title: isVi ? 'AI News' : 'AI News', description: isVi ? 'Cập nhật tin tức trí tuệ nhân tạo.' : 'Latest AI updates.', likes: 1200, followers: 15000, tags: ['AI', 'Tech'], isFollowed: true },
    ];
    
    // Add extra topics dynamically
    const extraTopics: CommunityTopic[] = [
        { id: 't11', categoryId: 'love', title: isVi ? 'Yêu xa (LDR)' : 'Long Distance (LDR)', description: isVi ? 'Hội những người yêu xa.' : 'Support for long distance relationships.', likes: 200, followers: 1200, tags: ['LDR', 'Dating'], isFollowed: false },
        { id: 't12', categoryId: 'sports', title: 'Pickleball', description: isVi ? 'Tìm hội chơi Pickleball.' : 'Find Pickleball partners.', likes: 450, followers: 3200, tags: ['Pickleball', 'Sports'], isFollowed: false },
        { id: 't13', categoryId: 'tech', title: 'Mechanical Keyboards', description: isVi ? 'Hội nghiện phím cơ.' : 'Custom keyboard enthusiasts.', likes: 800, followers: 5600, tags: ['Keyboards', 'Tech'], isFollowed: false },
    ];

    // Fill to 100 roughly
    for (let i = 14; i <= 100; i++) {
        const cats: CategoryId[] = ['love', 'sports', 'tech', 'lifestyle', 'arts', 'food'];
        const cat = cats[i % cats.length];
        extraTopics.push({
            id: `t${i}`,
            categoryId: cat,
            title: isVi ? `Chủ đề Cộng đồng ${i}` : `Community Topic ${i}`,
            description: isVi ? `Thảo luận về các xu hướng ${cat} thú vị.` : `Discussion about interesting ${cat} trends.`,
            likes: Math.floor(Math.random() * 1000),
            followers: Math.floor(Math.random() * 5000),
            tags: [cat.charAt(0).toUpperCase() + cat.slice(1), 'Trending'],
            isFollowed: false
        });
    }

    return [...baseTopics, ...extraTopics];
};

export const INITIAL_TOPICS = getInitialTopics('vi'); // Default for initial state

export const TRENDING_TAGS = [
    { tag: '#Bitcoin', posts: '240K' },
    { tag: '#SonTungMTP', posts: '150K' },
    { tag: '#DatingApp', posts: '89K' },
    { tag: '#HanoiCold', posts: '45K' },
    { tag: '#AIRevolution', posts: '12K' },
];

export const getMockCandidates = (lang: 'vi'|'en'): MatchCandidate[] => {
    const isVi = lang === 'vi';
    return [
      {
        id: 'c1',
        name: 'Emily Chen',
        age: 24,
        gender: UserGender.Female,
        location: isVi ? 'Quận 1, TP.HCM' : 'District 1, HCMC',
        bio: isVi ? 'Người nước ngoài sống tại Sài Gòn. Yêu ẩm thực đường phố và kiến trúc.' : 'Expat living in Saigon. Love street food and architecture.',
        interests: isVi ? ['Thiết kế', 'Ẩm thực', 'Kiến trúc', 'Du lịch'] : ['Design', 'Street Food', 'Architecture', 'Travel'],
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
        location: isVi ? 'Quận 3, TP.HCM' : 'District 3, HCMC',
        bio: isVi ? 'Founder startup. Tìm người chia sẻ ý tưởng và cà phê.' : 'Startup founder. Looking for someone to share ideas and coffee with.',
        interests: isVi ? ['Khởi nghiệp', 'Chạy bộ', 'Công nghệ', 'Cà phê'] : ['Startup', 'Running', 'Tech', 'Coffee'],
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
        bio: isVi ? 'Giáo viên Yoga. Yêu thiên nhiên và sống xanh.' : 'Yoga teacher. Love nature and sustainable living.',
        interests: isVi ? ['Yoga', 'Thiên nhiên', 'Ăn chay', 'Đọc sách'] : ['Yoga', 'Nature', 'Vegan', 'Reading'],
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
        location: isVi ? 'Bình Thạnh' : 'Binh Thanh District',
        bio: isVi ? 'Sinh viên Mỹ thuật. Mình vẽ và nghe nhạc Jazz.' : 'Art student. I paint and listen to jazz.',
        interests: isVi ? ['Nghệ thuật', 'Jazz', 'Vẽ', 'Mèo'] : ['Art', 'Jazz', 'Painting', 'Cats'],
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
        location: isVi ? 'Quận 7' : 'District 7',
        bio: isVi ? 'Chuyên viên tài chính ban ngày, game thủ ban đêm.' : 'Financial analyst by day, gamer by night.',
        interests: isVi ? ['Tài chính', 'Gaming', 'Gym', 'Đầu tư'] : ['Finance', 'Gaming', 'Gym', 'Investments'],
        photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'],
        matchPercentage: 68,
        distanceKm: 10.5,
        socials: { facebook: 'connected' }
      }
    ];
};

export const getMockGroups = (lang: 'vi'|'en'): MatchCandidate[] => {
    const isVi = lang === 'vi';
    return [
      {
        id: 'g1',
        name: 'Saigon Boardgames',
        age: 2023, 
        gender: UserGender.Other,
        location: isVi ? 'Quận 10' : 'District 10',
        bio: isVi ? 'Hội chơi boardgame hàng tuần. Welcome người mới!' : 'Weekly boardgame meetups. Beginners welcome!',
        interests: isVi ? ['Boardgames', 'Chiến thuật', 'Vui vẻ', 'Bia'] : ['Boardgames', 'Strategy', 'Fun', 'Beer'],
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
        bio: isVi ? 'Dành cho những người yêu ảnh film.' : 'For the love of analog photography.',
        interests: isVi ? ['Nhiếp ảnh', 'Nghệ thuật', 'Du lịch', 'Hoài cổ'] : ['Photography', 'Art', 'Travel', 'Vintage'],
        photos: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
        matchPercentage: 95,
        distanceKm: 2,
        socials: { instagram: 'connected' }
      }
    ];
}

export const MOCK_CANDIDATES = getMockCandidates('vi');
export const MOCK_GROUPS = getMockGroups('vi');

export const getMockPosts = (lang: 'vi'|'en'): SocialPost[] => {
    const isVi = lang === 'vi';
    return [
    {
        id: 'post1',
        topicId: 't1',
        authorId: 'ai_bot',
        authorName: isVi ? 'Tư Vấn Tình Yêu (AI)' : 'Love Advisor (AI)',
        authorAvatar: 'https://ui-avatars.com/api/?name=AI&background=db2777&color=fff',
        isAi: true,
        content: isVi 
            ? '🚩 5 dấu hiệu cho thấy bạn đang bị "thao túng tâm lý" trong tình yêu:\n\n1. Họ phủ nhận trí nhớ của bạn.\n2. Đổ lỗi ngược lại cho cảm xúc của bạn.\n3. Cô lập bạn khỏi bạn bè.\n\nĐã ai gặp trường hợp này chưa? 👇'
            : '🚩 5 signs you are being "gaslighted" in a relationship:\n\n1. They deny your memory.\n2. Blame you for your emotions.\n3. Isolate you from friends.\n\nAnyone experienced this? 👇',
        timestamp: Date.now() - 3600000,
        reactions: { like: 145, love: 52, haha: 2, wow: 5, sad: 40, angry: 12 },
        comments: [
            { id: 'c1', userId: 'u2', userName: 'Minh Tuấn', userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=40&q=80', text: isVi ? 'Sợ thật, mình từng bị mà không biết.' : 'Scary, I was a victim without knowing.', timestamp: Date.now() - 1800000, likes: 15 }
        ]
    },
    {
        id: 'post2',
        topicId: 't3',
        authorId: 'u3',
        authorName: 'Sarah Nguyễn',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=40&q=80',
        content: isVi 
            ? 'Mới tìm được quán rooftop view Landmark cực chill! 🌃🍸 \nGiá nước tầm 80k-120k, nhạc acoustic nhẹ nhàng. Ai muốn đi chung không?'
            : 'Found this chill rooftop with Landmark view! 🌃🍸 \nDrinks around 80k-120k, soft acoustic music. Anyone wanna join?',
        images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'],
        timestamp: Date.now() - 7200000,
        reactions: { like: 120, love: 50, haha: 0, wow: 10, sad: 0, angry: 0 },
        comments: []
    },
    {
        id: 'post3',
        topicId: 't10',
        authorId: 'u4',
        authorName: 'Tech Lead',
        authorAvatar: 'https://ui-avatars.com/api/?name=TL&background=0f172a&color=fff',
        content: isVi 
            ? 'Gemini 2.5 Flash mới ra mắt nhanh khủng khiếp. Anh em dev đã thử tích hợp vào app chưa? Khả năng xử lý JSON cực mượt. 🤖⚡️ #AI #Gemini #TechNews'
            : 'Gemini 2.5 Flash just launched and it is insanely fast. Devs, have you tried integrating it? JSON handling is smooth. 🤖⚡️ #AI #Gemini #TechNews',
        timestamp: Date.now() - 10000000,
        reactions: { like: 200, love: 20, haha: 5, wow: 42, sad: 0, angry: 0 },
        comments: [
            { id: 'c2', userId: 'u5', userName: 'Coder Girl', userAvatar: 'https://ui-avatars.com/api/?name=CG&background=ec4899&color=fff', text: isVi ? 'Đang test thử, latency thấp thật sự.' : 'Testing it now, latency is real low.', timestamp: Date.now() - 9000000, likes: 45 }
        ]
    },
    {
        id: 'post4',
        topicId: 't8',
        authorId: 'u6',
        authorName: 'Crypto King',
        authorAvatar: 'https://ui-avatars.com/api/?name=CK&background=f59e0b&color=fff',
        content: 'Bitcoin to the moon! 🚀🌕 Ai còn giữ hay đã bán hết rồi? #BTC #HODL',
        timestamp: Date.now() - 12000000,
        reactions: { like: 50, love: 0, haha: 10, wow: 5, sad: 2, angry: 0 },
        comments: []
    }
    ];
};

export const MOCK_POSTS = getMockPosts('vi');

export const INITIAL_CONVERSATIONS: Record<string, Conversation> = {
    'c2': {
        matchId: 'c2',
        messages: [
            { id: 'm1', senderId: 'c2', text: 'Chào Tuấn, mình cũng thích chạy bộ!', timestamp: Date.now() - 100000, type: 'text' },
            { id: 'm2', senderId: 'me', text: 'Chào bạn, cuối tuần này có giải marathon ở Q7 đó.', timestamp: Date.now() - 90000, type: 'text' }
        ],
        lastMessageTime: Date.now() - 90000,
        unreadCount: 0
    }
};
