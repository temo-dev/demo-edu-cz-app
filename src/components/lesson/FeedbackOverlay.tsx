import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { vocabMap } from "../../data/vocabulary";

interface Props {
  correct: boolean;
  vocabId?: string;
  onNext: () => void;
}

export default function FeedbackOverlay({ correct, vocabId, onNext }: Props) {
  const item = vocabId ? vocabMap[vocabId] : null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`fixed bottom-0  -translate-x-1/2 w-full max-w-md rounded-t-3xl p-6 z-50 ${
        correct
          ? "bg-orange-50 border-t-4 border-brand-orange"
          : "bg-red-50 border-t-4 border-red-400"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        {correct ? (
          <CheckCircle size={32} className="text-brand-orange" />
        ) : (
          <XCircle size={32} className="text-red-500" />
        )}
        <div>
          <p
            className={`font-extrabold text-lg ${correct ? "text-brand-orange" : "text-red-600"}`}
          >
            {correct ? "Xuất sắc! 🎉" : "Chưa đúng 😅"}
          </p>
          {!correct && item && (
            <p className="text-red-500 text-sm">
              Đáp án: <span className="font-bold">{item.czech}</span> ={" "}
              {item.vietnamese}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        className={`w-full font-bold py-4 rounded-2xl text-white text-lg transition-transform active:scale-95 ${
          correct
            ? "bg-brand-orange shadow-lg shadow-orange-200"
            : "bg-red-500 shadow-lg shadow-red-200"
        }`}
      >
        Tiếp tục →
      </button>
    </motion.div>
  );
}
