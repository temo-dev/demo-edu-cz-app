export interface SM2Record {
  vocabId: string
  easeFactor: number   // starts at 2.5
  interval: number     // days
  repetitions: number
  nextReviewDate: string // ISO date string
}

export function createRecord(vocabId: string): SM2Record {
  return {
    vocabId,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: todayISO(),
  }
}

// quality: 0–5  (0-1 = wrong, 2 = hard, 3 = ok, 4 = good, 5 = perfect)
export function updateSM2(record: SM2Record, quality: number): SM2Record {
  const q = Math.max(0, Math.min(5, Math.round(quality)))
  let { easeFactor, interval, repetitions } = record

  if (q < 3) {
    // Failed — reset
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)

    repetitions += 1
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  }

  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + interval)

  return {
    ...record,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextDate.toISOString().split('T')[0],
  }
}

export function isDue(record: SM2Record): boolean {
  return record.nextReviewDate <= todayISO()
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}
