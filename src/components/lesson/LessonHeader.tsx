import { X, Heart } from "lucide-react";

interface Props {
  progress: number; // 0–1
  hearts: number;
  maxHearts: number;
  onExit: () => void;
}

export default function LessonHeader({
  progress,
  hearts,
  maxHearts,
  onExit,
}: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
      <button
        onClick={onExit}
        className="p-1 text-gray-400 hover:text-gray-600"
      >
        <X size={22} />
      </button>

      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-orange rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: maxHearts }).map((_, i) => (
          <Heart
            key={i}
            size={20}
            className={
              i < hearts
                ? "text-red-500 fill-red-500"
                : "text-gray-200 fill-gray-200"
            }
          />
        ))}
      </div>
    </div>
  );
}
