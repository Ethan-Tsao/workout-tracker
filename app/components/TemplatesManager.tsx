"use client";
import React, { useEffect, useState } from "react";

type Template = {
  id: number;
  name: string;
  exercises: { id: number; name: string }[];
};

type Props = {
  onApply: (exerciseNames: string[]) => void; // What to do when "Apply" is clicked
  currentWorkoutExercises: string[];
};

export default function TemplatesManager({ onApply, currentWorkoutExercises }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newName, setNewName] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Load templates
  useEffect(() => {
    fetch("/api/templates").then(res => res.json()).then(setTemplates);
  }, []);

  // Save as template
  async function saveTemplate() {
    if (!newName.trim() || !currentWorkoutExercises.length) return;
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        exercises: currentWorkoutExercises,
      }),
    });
    if (res.ok) {
      setTemplates([await res.json(), ...templates]);
      setNewName("");
      setShowInput(false);
    }
  }

  // Delete template
  async function deleteTemplate(id: number) {
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    setTemplates(templates.filter(t => t.id !== id));
  }

  return (
    <div className="mb-8 bg-gray-50 p-4 rounded shadow">
      <div className="font-bold mb-2 text-gray-900">Templates</div>
      <div className="mb-2 flex gap-2">
        <button
          className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={() => setShowInput(!showInput)}
        >
          Save Current as Template
        </button>
        {showInput && (
          <>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Template name"
              className="border px-2 py-1 rounded text-gray-900"
            />
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={saveTemplate}
            >
              Save
            </button>
            <button
              className="bg-gray-200 px-2 py-1 rounded text-gray-900"
              onClick={() => {
                setNewName("");
                setShowInput(false);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
      <ul>
        {templates.map(t => (
          <li key={t.id} className="flex items-center justify-between py-1 border-b last:border-b-0 text-gray-900">
            <span>{t.name} ({t.exercises.length} ex)</span>
            <div className="flex gap-2">
              <button
                className="text-blue-600 underline"
                onClick={() => onApply(t.exercises.map(e => e.name))}
              >
                Apply
              </button>
              <button
                className="text-red-500 underline"
                onClick={() => deleteTemplate(t.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
