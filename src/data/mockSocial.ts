import type { CEFRLevel } from '../types/content'

export interface MockUser {
  id: string
  name: string
  avatar: string
  level: CEFRLevel
  xp: number
  streak: number
  country: string
  bio: string
}

export interface MockClass {
  id: string
  title: string
  teacher: string
  teacherAvatar: string
  level: CEFRLevel
  schedule: string
  duration: number // minutes
  students: number
  maxStudents: number
  meetLink: string
  description: string
  nextSession: string
  tags: string[]
}

export interface MockMessage {
  userId: string
  text: string
  time: string
}

export const mockUsers: MockUser[] = [
  { id: 'u1', name: 'Minh Anh', avatar: '👩', level: 'A1', xp: 340, streak: 12, country: 'VN', bio: 'Học tiếng Séc để đi du học Praha!' },
  { id: 'u2', name: 'Tuấn Kiệt', avatar: '👦', level: 'A2', xp: 1250, streak: 45, country: 'VN', bio: 'Đang làm việc ở Brno.' },
  { id: 'u3', name: 'Hồng Nhung', avatar: '👩‍🦱', level: 'A1', xp: 180, streak: 3, country: 'VN', bio: 'Mới bắt đầu học!' },
  { id: 'u4', name: 'Đức Huy', avatar: '🧑', level: 'B1', xp: 4200, streak: 120, country: 'CZ', bio: 'Sống ở Praha 5 năm rồi.' },
  { id: 'u5', name: 'Lan Phương', avatar: '👩‍🦰', level: 'A2', xp: 890, streak: 22, country: 'VN', bio: 'Yêu văn hóa Séc ❤️' },
  { id: 'u6', name: 'Văn Thành', avatar: '👨', level: 'A1', xp: 420, streak: 8, country: 'VN', bio: 'Học để hiểu bạn gái người Séc 😄' },
  { id: 'u7', name: 'Bảo Châu', avatar: '👧', level: 'A2', xp: 760, streak: 31, country: 'VN', bio: 'Sinh viên, chuẩn bị apply học bổng Séc.' },
  { id: 'u8', name: 'Quang Minh', avatar: '🧑‍💼', level: 'B1', xp: 3100, streak: 88, country: 'CZ', bio: 'Kỹ sư IT tại Prague.' },
]

export const mockClasses: MockClass[] = [
  {
    id: 'c1', level: 'A1',
    title: 'Tiếng Séc cơ bản — Nhóm buổi sáng',
    teacher: 'Cô Petra Nováková', teacherAvatar: '👩‍🏫',
    schedule: 'Thứ 2, 4, 6 — 8:00 SA (ICT)',
    duration: 60, students: 4, maxStudents: 6,
    meetLink: 'https://meet.google.com',
    description: 'Lớp học nhỏ 4-6 người cho người mới bắt đầu. Tập trung vào giao tiếp hàng ngày, phát âm và từ vựng cơ bản.',
    nextSession: 'Thứ 2, 08:00',
    tags: ['beginner', 'speaking', 'small-group'],
  },
  {
    id: 'c2', level: 'A2',
    title: 'Tiếng Séc giao tiếp — Trung cấp',
    teacher: 'Thầy Jan Svoboda', teacherAvatar: '👨‍🏫',
    schedule: 'Thứ 3, 5 — 7:00 PM (ICT)',
    duration: 90, students: 3, maxStudents: 5,
    meetLink: 'https://meet.google.com',
    description: 'Luyện hội thoại thực tế: mua sắm, nhà hàng, bệnh viện. Có bài tập về nhà và sửa bài cụ thể.',
    nextSession: 'Thứ 3, 19:00',
    tags: ['conversation', 'A2', 'practical'],
  },
  {
    id: 'c3', level: 'B1',
    title: 'Czech Business & Work',
    teacher: 'Cô Marie Dvořáková', teacherAvatar: '👩‍💼',
    schedule: 'Thứ 7 — 10:00 SA (ICT)',
    duration: 120, students: 2, maxStudents: 4,
    meetLink: 'https://meet.google.com',
    description: 'Tiếng Séc trong môi trường công sở, phỏng vấn xin việc, email chuyên nghiệp. Dành cho người đi làm tại Séc.',
    nextSession: 'Thứ 7, 10:00',
    tags: ['business', 'work', 'B1'],
  },
  {
    id: 'c4', level: 'A1',
    title: 'Nhóm luyện tập buổi tối',
    teacher: 'Cô Lucie Procházková', teacherAvatar: '🧑‍🏫',
    schedule: 'Thứ 2, 4 — 9:00 PM (ICT)',
    duration: 45, students: 5, maxStudents: 6,
    meetLink: 'https://meet.google.com',
    description: 'Lớp ngắn 45 phút buổi tối. Ôn tập từ vựng và ngữ pháp A1 theo chủ đề mỗi buổi.',
    nextSession: 'Thứ 2, 21:00',
    tags: ['evening', 'A1', 'vocabulary'],
  },
]

export const mockGroupMessages: MockMessage[] = [
  { userId: 'u2', text: 'Ahoj všichni! Hôm nay học bài gì vậy mọi người?', time: '09:12' },
  { userId: 'u1', text: 'Mình đang học số đếm, khó quá 😅', time: '09:15' },
  { userId: 'u5', text: 'Haha, tôi cũng vậy! "Čtyřiadvacet" = 24 mà đọc mãi không được 🤣', time: '09:18' },
  { userId: 'u4', text: 'Tip: đọc từng phần nhỏ trước — čtyři (4) + dvacet (20)', time: '09:20' },
  { userId: 'u7', text: 'Cảm ơn anh! Btw cô Petra dạy hay lắm, ai chưa vào lớp của cô thì thử đi', time: '09:25' },
  { userId: 'u3', text: 'Mình mới join hôm qua, app này hay quá 🇨🇿', time: '09:30' },
  { userId: 'u8', text: 'Chúc mọi người học tốt! Nezapomeňte procvičovat každý den 💪', time: '09:35' },
]
