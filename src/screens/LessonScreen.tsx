import { AnimatePresence, motion } from 'framer-motion'
import { useLesson } from '../hooks/useLesson'
import { useProgressStore } from '../store/progressStore'
import { useUserStore } from '../store/userStore'
import { useNav } from '../App'
import { unitOfLesson } from '../data/curriculum'
import LessonHeader from '../components/lesson/LessonHeader'
import FeedbackOverlay from '../components/lesson/FeedbackOverlay'
import LessonComplete from '../components/lesson/LessonComplete'
import FlashCard from '../components/exercises/FlashCard'
import MultipleChoice from '../components/exercises/MultipleChoice'
import MatchingPairs from '../components/exercises/MatchingPairs'
import FillInTheBlank from '../components/exercises/FillInTheBlank'
import ListeningExercise from '../components/exercises/ListeningExercise'
import SpeakingExercise from '../components/exercises/SpeakingExercise'
import GrammarExercise from '../components/exercises/GrammarExercise'
import ReadingExercise from '../components/exercises/ReadingExercise'
import WritingExercise from '../components/exercises/WritingExercise'
import VideoExercise from '../components/exercises/VideoExercise'

interface Props {
  lessonId: string
}

export default function LessonScreen({ lessonId }: Props) {
  const { navigate } = useNav()
  const { completeLesson } = useProgressStore()
  const { addXP } = useUserStore()
  const {
    lesson,
    currentExercise,
    index,
    total,
    hearts,
    maxHearts,
    correct,
    phase,
    lastCorrect,
    progress,
    stars,
    submitAnswer,
    advance,
  } = useLesson(lessonId)

  if (!lesson) return <div className="p-8 text-center text-gray-500">Không tìm thấy bài học</div>

  if (phase === 'complete') {
    return (
      <LessonComplete
        lessonTitle={lesson.title}
        xpEarned={lesson.xpReward}
        correct={correct}
        total={total}
        stars={stars}
        onContinue={() => {
          completeLesson(lessonId, stars)
          addXP(lesson.xpReward)
          navigate('course')
        }}
      />
    )
  }

  function getVocabIdFromExercise() {
    if (!currentExercise) return undefined
    if ('vocabId' in currentExercise) return currentExercise.vocabId
    return undefined
  }

  const unit = unitOfLesson[lessonId]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LessonHeader
        progress={progress}
        hearts={hearts}
        maxHearts={maxHearts}
        onExit={() => navigate('course')}
      />

      {/* Exercise Title */}
      <div className={`${unit?.color ?? 'bg-gray-400'} px-5 py-3`}>
        <p className="text-white font-bold text-sm">{lesson.title}</p>
        <p className="text-white/70 text-xs">{index + 1} / {total}</p>
      </div>

      {/* Exercise Area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${lessonId}-${index}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="py-6"
          >
            {currentExercise?.type === 'flashcard' && (
              <FlashCard
                vocabId={currentExercise.vocabId}
                onContinue={submitAnswer}
              />
            )}

            {currentExercise?.type === 'multipleChoice' && (
              <MultipleChoice
                question={currentExercise.question}
                questionLang={currentExercise.questionLang}
                vocabId={currentExercise.vocabId}
                options={currentExercise.options}
                correctId={currentExercise.correctId}
                onAnswer={submitAnswer}
              />
            )}

            {currentExercise?.type === 'matching' && (
              <MatchingPairs
                pairs={currentExercise.pairs}
                onComplete={submitAnswer}
              />
            )}

            {currentExercise?.type === 'fillBlank' && (
              <FillInTheBlank
                sentenceVi={currentExercise.sentenceVi}
                answer={currentExercise.answer}
                wordBank={currentExercise.wordBank}
                onAnswer={submitAnswer}
              />
            )}

            {currentExercise?.type === 'listening' && (
              <ListeningExercise
                vocabId={currentExercise.vocabId}
                options={currentExercise.options}
                correctId={currentExercise.correctId}
                onAnswer={submitAnswer}
              />
            )}

            {currentExercise?.type === 'speaking' && (
              <SpeakingExercise
                vocabId={currentExercise.vocabId}
                prompt={currentExercise.prompt}
                answer={currentExercise.answer}
                pronunciation={currentExercise.pronunciation}
                onAnswer={submitAnswer}
              />
            )}

            {currentExercise?.type === 'grammar' && (
              <GrammarExercise
                ruleTitle={currentExercise.ruleTitle}
                ruleVi={currentExercise.ruleVi}
                example={currentExercise.example}
                question={currentExercise.question}
                options={currentExercise.options}
                correctId={currentExercise.correctId}
                explanation={currentExercise.explanation}
                onAnswer={submitAnswer}
              />
            )}

            {currentExercise?.type === 'reading' && (
              <ReadingExercise
                passageCs={currentExercise.passageCs}
                passageVi={currentExercise.passageVi}
                questions={currentExercise.questions}
                onAnswer={submitAnswer}
              />
            )}

            {currentExercise?.type === 'writing' && (
              <WritingExercise
                promptVi={currentExercise.promptVi}
                answer={currentExercise.answer}
                hint={currentExercise.hint}
                onAnswer={submitAnswer}
              />
            )}

            {currentExercise?.type === 'video' && (
              <VideoExercise
                youtubeId={currentExercise.youtubeId}
                title={currentExercise.title}
                level={currentExercise.level}
                question={currentExercise.question}
                options={currentExercise.options}
                correctId={currentExercise.correctId}
                onAnswer={submitAnswer}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {phase === 'feedback' && lastCorrect !== null && (
          <FeedbackOverlay
            correct={lastCorrect}
            vocabId={getVocabIdFromExercise()}
            onNext={advance}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
