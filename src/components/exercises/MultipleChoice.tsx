import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { vocabMap } from "../../data/vocabulary";
import { useAudio } from "../../hooks/useAudio";

interface Props {
  question: string;
  questionLang: "czech" | "vietnamese";
  vocabId: string;
  options: Array<{ id: string; text: string }>;
  correctId: string;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({
  question,
  questionLang,
  vocabId,
  options,
  correctId,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { speak } = useAudio();
  const item = vocabMap[vocabId];

  function handleSelect(id: string) {
    if (selected) return;
    setSelected(id);
    const correct = id === correctId;
    speak(item?.czech ?? question);
    setTimeout(() => onAnswer(correct), 800);
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-4">
      {/* Question */}
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-6 flex flex-col items-center gap-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {questionLang === "czech"
            ? "Tiếng Séc nghĩa là gì?"
            : "Dịch sang tiếng Séc"}
        </p>
        <p className="text-2xl font-extrabold text-gray-800 text-center break-words">
          {question}
        </p>
        {questionLang === "czech" && (
          <button
            onClick={() => speak(question)}
            className="flex items-center gap-2 text-brand-orange bg-orange-50 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <Volume2 size={16} />
            Nghe
          </button>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          let style = "bg-white border-2 border-gray-200 text-gray-800";
          if (selected) {
            if (opt.id === correctId)
              style = "bg-brand-orange border-2 border-brand-orange text-white";
            else if (opt.id === selected)
              style = "bg-brand-red border-2 border-brand-red text-white";
            else style = "bg-gray-50 border-2 border-gray-100 text-gray-400";
          }

          return (
            <motion.button
              key={opt.id}
              whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt.id)}
              className={`w-full px-5 py-4 rounded-2xl font-semibold text-left text-base transition-colors ${style}`}
            >
              {opt.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
