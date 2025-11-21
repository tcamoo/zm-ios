
import React from 'react';

// --- OS Types ---
export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  component: React.ReactNode;
  icon: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface CountdownEvent {
  id: string;
  title: string;
  targetDate: string;
  color: string;
}

export interface MusicTrack {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    type: 'netease' | 'direct';
    source: string; // Netease ID or MP3 URL
    addedAt: number;
}

export interface AppData {
  notes: Note[];
  events: CountdownEvent[];
  music: MusicTrack[];
  settings: {
      wallpaper: string;
      theme: 'light' | 'dark';
  };
}

export interface AppProps {
  data: AppData;
  onUpdate: (newData: Partial<AppData>) => void;
}

// --- CMS / Website Types ---

export type ThemeMode = 'cyberpunk' | 'acid' | 'vaporwave' | 'light' | 'dark';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  plays: number;
  coverUrl: string;
  audioUrl?: string;
  lyrics?: string;
  neteaseId?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  coverUrl: string;
  linkedTrackId?: string;
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  status: 'active' | 'guest';
}

export interface HeroData {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  marqueeText: string;
  buttonText?: string;
  heroImage: string;
}

export interface FeaturedAlbum {
  title: string;
  type: string;
  description: string;
  coverUrl: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  provider: 'aliyun' | 'baidu' | 'quark' | 'google' | 'other';
  link: string;
  accessCode?: string;
  size?: string;
  date: string;
}

export interface CloudConfig {
  enabled: boolean;
  provider?: 'r2' | 's3';
  publicDomain?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  endpoint?: string;
  // Legacy fields (optional)
  accessKey?: string;
  secretKey?: string;
  bucket?: string;
}

export interface ContactConfig {
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  footerText: string;
}

export interface NavItem {
  id: string;
  label: string;
  targetId: string;
}

export interface CloudIntegrations {
  aliDrive?: CloudConfig;
  oneDrive?: CloudConfig;
  cloudflare?: CloudConfig;
}

export interface SiteData {
  hero: HeroData;
  featuredAlbum: FeaturedAlbum;
  tracks: Track[];
  articles: Article[];
  artists: Artist[];
  resources: Resource[];
  storage: CloudConfig;
  contact: ContactConfig;
  theme: ThemeMode;
  navigation?: NavItem[];
  integrations?: CloudIntegrations;
}
