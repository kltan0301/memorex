"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string, source: string) => void;
}

export default function CaptureModal({ open, onClose, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  function handleSubmit() {
    if (!text.trim()) return;
    onSubmit(text.trim(), source.trim());
    setText("");
    setSource("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && e.metaKey) handleSubmit();
    if (e.key === "Escape") onClose();
  }

  if (!open) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold">What did you learn today?</h2>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your idea, insight or quote..."
          rows={4}
          className="w-full resize-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent p-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />

        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Source (book, article, website…)"
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent p-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
