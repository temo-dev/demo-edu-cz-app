/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/preserve-manual-memoization */
import { useState, useMemo, useCallback } from "react";
import type { Exercise } from "../types/exercise";
import { buildExercises } from "../engine/lessonRunner";
import { lessonMap } from "../data/curriculum";
import { useReviewStore } from "../store/reviewStore";

const MAX_HEARTS = 3;

export type LessonPhase = "exercise" | "feedback" | "complete";

export function useLesson(lessonId: string) {
  const lesson = lessonMap[lessonId];
  const exercises = useMemo(
    () => (lesson ? buildExercises(lesson) : []),
    [lessonId],
  );

  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [correct, setCorrect] = useState(0);
  const [phase, setPhase] = useState<LessonPhase>("exercise");
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const addVocabToReview = useReviewStore((s) => s.addVocabToReview);

  const currentExercise: Exercise | null = exercises[index] ?? null;
  const progress = exercises.length > 0 ? index / exercises.length : 0;
  const stars: 1 | 2 | 3 = hearts === 3 ? 3 : hearts === 2 ? 2 : 1;

  const submitAnswer = useCallback(
    (isCorrect: boolean) => {
      // Add vocab to SRS
      const ex = exercises[index];
      if (ex && "vocabId" in ex) addVocabToReview(ex.vocabId);
      if (ex?.type === "matching") {
        ex.pairs.forEach((p) => addVocabToReview(p.id));
      }

      if (!isCorrect) setHearts((h) => Math.max(0, h - 1));
      else setCorrect((c) => c + 1);

      setLastCorrect(isCorrect);
      setPhase("feedback");
    },
    [index, exercises, addVocabToReview],
  );

  const advance = useCallback(() => {
    if (index + 1 >= exercises.length) {
      setPhase("complete");
    } else {
      setIndex((i) => i + 1);
      setPhase("exercise");
      setLastCorrect(null);
    }
  }, [index, exercises.length]);

  return {
    lesson,
    currentExercise,
    index,
    total: exercises.length,
    hearts,
    maxHearts: MAX_HEARTS,
    correct,
    phase,
    lastCorrect,
    progress,
    stars,
    submitAnswer,
    advance,
  };
}
