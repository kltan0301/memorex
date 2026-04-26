"use client";

import { useState } from "react";
import CaptureModal from "@/components/CaptureModal";
import FloatingActionButton from "@/components/FloatingActionButton";

interface Entry {
  id: string;
  text: string;
  source: string;
  createdAt: Date;
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  function handleSubmit(text: string, source: string) {
    const optimistic: Entry = {
      id: crypto.randomUUID(),
      text,
      source,
      createdAt: new Date(),
    };

    setEntries((prev) => [optimistic, ...prev]);
    setModalOpen(false);

    fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).catch(console.error);
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-6">Your Reading Feed</h1>

      {entries.length === 0 ? (
        <p className="text-sm text-zinc-500">No entries yet. Press + to capture something.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <p className="text-sm">{entry.text}</p>
              {entry.source && (
                <p className="text-xs text-zinc-400 mt-1">{entry.source}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <FloatingActionButton onClick={() => setModalOpen(true)} />
      <CaptureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
