
export enum UserGender {
  Male = "Male",
  Female = "Female",
  NonBinary = "Non-binary",
  Other = "Other"
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  cover: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'momo';
  last4: string;
  expiry: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  notifications: boolean;
  chatBackground?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  age: number;
  gender: UserGender;
  location: string; 
  coordinates?: { lat: number; lng: number };
  bio: string;
  job?: string;
  birthday?: string;
  interests: string[];
  photos: string[];
  isVerified?: boolean; 
  socials: {
    instagram?: string;
    spotify?: string;
    facebook?: string;
    google?: string;
  };
  spotifyTopTracks?: SpotifyTrack[];
  instagramPosts?: InstagramPost[];
  paymentMethods?: PaymentMethod[];
  settings?: UserSettings;
}

export interface MatchCandidate extends UserProfile {
  matchPercentage: number;
  distanceKm: number;
}

export interface DatePlan {
  name: string;
  address: string;
  suggested_time: string;
  description: string;
  reason: string;
  coordinates?: { lat: number, lng: number };
  whoPays?: { payer: string, reason: string };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image' | 'location_suggestion';
  senderName?: string; 
  senderAvatar?: string; 
  isAi?: boolean;
}

export interface Conversation {
  matchId: string;
  messages: ChatMessage[];
  datePlan?: DatePlan;
  lastMessageTime: number;
  unreadCount: number;
}

export interface MatchContext {
  candidate: MatchCandidate;
  venueSuggestion?: DatePlan;
  meetingTime?: string;
  chatHistory: ChatMessage[];
}

export enum AppTab {
  Community = 'community',
  Matching = 'matching',
  Groups = 'groups',
  Chat = 'chat',
  Profile = 'profile'
}

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: number;
  likes: number;
}

export interface SocialPost {
  id: string;
  topicId: string; 
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isAi?: boolean;
  content: string;
  images?: string[];
  timestamp: number;
  reactions: Record<ReactionType, number>;
  comments: PostComment[];
  userReaction?: ReactionType; 
}

export type CategoryId = 'love' | 'sports' | 'tech' | 'lifestyle' | 'arts' | 'food';

export interface CommunityCategory {
  id: CategoryId;
  name: string;
  iconName: string; 
}

export interface CommunityTopic {
  id: string;
  categoryId: CategoryId;
  title: string;
  description: string;
  likes: number;
  followers: number; 
  tags: string[];
  isFollowed?: boolean; 
}

export interface MatchFilters {
  ageRange: [number, number];
  community?: string;
  maxDistance: number;
  minTimeFrame: 'asap' | 'tonight' | 'weekend' | 'any';
}

export type TranslationDictionary = {
  [key: string]: string;
};
