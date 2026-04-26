"use client";

interface Props {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Capture new entry"
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white text-3xl shadow-lg hover:bg-zinc-800 transition-colors flex items-center justify-center"
    >
      +
    </button>
  );
}
