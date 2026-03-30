import type { Course } from '../types/content'

export const course: Course = {
  id: 'czech-vi-beginner',
  title: 'Tiếng Séc cho người Việt',
  level: 'beginner',
  units: [
    {
      id: 'unit1',
      title: 'Chào Hỏi',
      subtitle: 'Greetings & Introductions',
      color: 'bg-emerald-500',
      darkColor: 'bg-emerald-600',
      icon: '👋',
      lessons: [
        {
          id: 'u1l1',
          title: 'Từ Vựng Chào Hỏi',
          subtitle: 'Học các câu chào cơ bản',
          xpReward: 10,
          exercises: [
            { type: 'flashcard', vocabIds: ['cs_001', 'cs_002', 'cs_003', 'cs_004'] },
            { type: 'multipleChoice', vocabIds: ['cs_001', 'cs_002', 'cs_003', 'cs_004'] },
            { type: 'flashcard', vocabIds: ['cs_005', 'cs_006', 'cs_007'] },
            { type: 'multipleChoice', vocabIds: ['cs_005', 'cs_006', 'cs_007'] },
          ],
        },
        {
          id: 'u1l2',
          title: 'Tự Giới Thiệu',
          subtitle: 'Cách giới thiệu bản thân',
          xpReward: 10,
          exercises: [
            { type: 'flashcard', vocabIds: ['cs_008', 'cs_009', 'cs_010', 'cs_011', 'cs_012'] },
            { type: 'matching', vocabIds: ['cs_001', 'cs_002', 'cs_003', 'cs_004', 'cs_006', 'cs_007'] },
            { type: 'multipleChoice', vocabIds: ['cs_008', 'cs_009', 'cs_010', 'cs_011'] },
          ],
        },
        {
          id: 'u1l3',
          title: 'Luyện Nghe',
          subtitle: 'Nghe và nhận diện tiếng Séc',
          xpReward: 15,
          exercises: [
            { type: 'listening', vocabIds: ['cs_001', 'cs_002', 'cs_003', 'cs_004'] },
            { type: 'listening', vocabIds: ['cs_005', 'cs_006', 'cs_007', 'cs_008'] },
            { type: 'fillBlank', vocabIds: ['cs_001', 'cs_004', 'cs_005', 'cs_006', 'cs_007'] },
          ],
        },
        {
          id: 'u1l4',
          title: 'Luyện Nói',
          subtitle: 'Phát âm tiếng Séc đúng chuẩn',
          xpReward: 20,
          exercises: [
            { type: 'speaking', vocabIds: ['cs_001', 'cs_002', 'cs_003', 'cs_004', 'cs_005', 'cs_006', 'cs_007'] },
          ],
        },
      ],
    },
    {
      id: 'unit2',
      title: 'Số Đếm 1–10',
      subtitle: 'Numbers & Counting',
      color: 'bg-violet-500',
      darkColor: 'bg-violet-600',
      icon: '🔢',
      prerequisiteUnitId: 'unit1',
      lessons: [
        {
          id: 'u2l1',
          title: 'Số 1 đến 5',
          subtitle: 'Học số từ một đến năm',
          xpReward: 10,
          exercises: [
            { type: 'flashcard', vocabIds: ['cs_101', 'cs_102', 'cs_103', 'cs_104', 'cs_105'] },
            { type: 'multipleChoice', vocabIds: ['cs_101', 'cs_102', 'cs_103', 'cs_104', 'cs_105'] },
            { type: 'matching', vocabIds: ['cs_101', 'cs_102', 'cs_103', 'cs_104', 'cs_105'] },
          ],
        },
        {
          id: 'u2l2',
          title: 'Số 6 đến 10',
          subtitle: 'Học số từ sáu đến mười',
          xpReward: 10,
          exercises: [
            { type: 'flashcard', vocabIds: ['cs_106', 'cs_107', 'cs_108', 'cs_109', 'cs_110'] },
            { type: 'multipleChoice', vocabIds: ['cs_106', 'cs_107', 'cs_108', 'cs_109', 'cs_110'] },
            { type: 'matching', vocabIds: ['cs_106', 'cs_107', 'cs_108', 'cs_109', 'cs_110'] },
          ],
        },
        {
          id: 'u2l3',
          title: 'Luyện Nghe Số',
          subtitle: 'Nghe số đếm tiếng Séc',
          xpReward: 15,
          exercises: [
            { type: 'listening', vocabIds: ['cs_101', 'cs_102', 'cs_103', 'cs_104', 'cs_105'] },
            { type: 'listening', vocabIds: ['cs_106', 'cs_107', 'cs_108', 'cs_109', 'cs_110'] },
            { type: 'matching', vocabIds: ['cs_101', 'cs_103', 'cs_105', 'cs_107', 'cs_109', 'cs_110'] },
          ],
        },
        {
          id: 'u2l4',
          title: 'Luyện Nói Số',
          subtitle: 'Đọc số đếm tiếng Séc',
          xpReward: 20,
          exercises: [
            { type: 'speaking', vocabIds: ['cs_101', 'cs_102', 'cs_103', 'cs_104', 'cs_105', 'cs_106', 'cs_107', 'cs_108', 'cs_109', 'cs_110'] },
          ],
        },
      ],
    },
  ],
}

// Flat lookup maps
export const allLessons = course.units.flatMap((u) => u.lessons)
export const lessonMap = Object.fromEntries(allLessons.map((l) => [l.id, l]))
export const unitOfLesson = Object.fromEntries(
  course.units.flatMap((u) => u.lessons.map((l) => [l.id, u]))
)
