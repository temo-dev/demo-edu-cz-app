import type { CEFRLevel } from '../types/content'

export interface MediaItem {
  id: string
  title: string
  description: string
  type: 'video' | 'podcast' | 'music'
  level: CEFRLevel
  youtubeId?: string
  externalUrl?: string
  durationMin: number
  tags: string[]
  channel?: string
}

export const mediaItems: MediaItem[] = [
  // Videos A1
  {
    id: 'm01', level: 'A1', type: 'video',
    title: 'Chào hỏi bằng tiếng Séc',
    description: 'Học các câu chào hỏi cơ bản với phát âm chuẩn từ người bản xứ.',
    youtubeId: 'dQw4w9WgXcQ', // placeholder
    channel: 'Czech for Beginners',
    durationMin: 8, tags: ['greetings', 'A1', 'basics'],
  },
  {
    id: 'm02', level: 'A1', type: 'video',
    title: 'Số đếm 1-20 tiếng Séc',
    description: 'Học đếm số tiếng Séc với nhạc vui nhộn.',
    youtubeId: 'dQw4w9WgXcQ',
    channel: 'Learn Czech Now',
    durationMin: 5, tags: ['numbers', 'A1'],
  },
  {
    id: 'm03', level: 'A1', type: 'video',
    title: 'Cuộc sống ở Praha vlog',
    description: 'Vlogger Việt Nam chia sẻ cuộc sống tại Praha — tiếng Việt.',
    youtubeId: 'dQw4w9WgXcQ',
    channel: 'Người Việt ở Séc',
    durationMin: 12, tags: ['lifestyle', 'prague', 'vlog'],
  },
  // Videos A2
  {
    id: 'm04', level: 'A2', type: 'video',
    title: 'Đi chợ ở Séc — hội thoại thực tế',
    description: 'Xem cách mua rau củ tại chợ Praha với phụ đề tiếng Việt.',
    youtubeId: 'dQw4w9WgXcQ',
    channel: 'Easy Czech',
    durationMin: 10, tags: ['shopping', 'A2', 'dialogue'],
  },
  {
    id: 'm05', level: 'A2', type: 'video',
    title: 'Gặp bác sĩ bằng tiếng Séc',
    description: 'Học từ vựng y tế và hội thoại tại phòng khám.',
    youtubeId: 'dQw4w9WgXcQ',
    channel: 'Czech Language School',
    durationMin: 15, tags: ['health', 'A2', 'medical'],
  },
  {
    id: 'm06', level: 'A2', type: 'video',
    title: 'Đi nhà hàng — gọi món tiếng Séc',
    description: 'Cách gọi món ăn, hỏi giá và thanh toán tại nhà hàng.',
    youtubeId: 'dQw4w9WgXcQ',
    channel: 'Easy Czech',
    durationMin: 8, tags: ['restaurant', 'food', 'A2'],
  },
  // Videos B1
  {
    id: 'm07', level: 'B1', type: 'video',
    title: 'Tin tức Séc — đọc chậm',
    description: 'Đoạn tin tức ngắn đọc chậm với phụ đề tiếng Séc.',
    youtubeId: 'dQw4w9WgXcQ',
    channel: 'Slow Czech News',
    durationMin: 5, tags: ['news', 'B1', 'reading'],
  },
  {
    id: 'm08', level: 'B1', type: 'video',
    title: 'Phỏng vấn xin việc bằng tiếng Séc',
    description: 'Mô phỏng buổi phỏng vấn thực tế với từ vựng công sở.',
    youtubeId: 'dQw4w9WgXcQ',
    channel: 'Czech Business Language',
    durationMin: 18, tags: ['work', 'interview', 'B1'],
  },
  // Podcasts
  {
    id: 'm09', level: 'A2', type: 'podcast',
    title: 'Easy Czech Podcast',
    description: 'Podcast tiếng Séc cho người mới học — phát âm rõ, chậm.',
    externalUrl: 'https://www.easyczech.com/podcast',
    durationMin: 20, tags: ['podcast', 'A2'],
  },
  {
    id: 'm10', level: 'B1', type: 'podcast',
    title: 'Čeština pro cizince',
    description: 'Podcast dạy ngữ pháp cho người nước ngoài.',
    externalUrl: 'https://open.spotify.com',
    durationMin: 25, tags: ['podcast', 'grammar', 'B1'],
  },
  // Music
  {
    id: 'm11', level: 'A1', type: 'music',
    title: 'Nhạc thiếu nhi tiếng Séc',
    description: 'Playlist nhạc thiếu nhi — dễ nghe, từ vựng đơn giản.',
    externalUrl: 'https://www.youtube.com/playlist?list=PLtest',
    durationMin: 30, tags: ['music', 'A1', 'children'],
  },
  {
    id: 'm12', level: 'A2', type: 'music',
    title: 'Nhạc pop Séc phổ biến',
    description: 'Các bài hát pop Séc hot nhất — học qua lời bài hát.',
    externalUrl: 'https://open.spotify.com',
    durationMin: 45, tags: ['music', 'pop', 'A2'],
  },
]
