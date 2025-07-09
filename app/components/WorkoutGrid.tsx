"use client";
import React, { useState, useEffect } from "react";
import ExerciseRow from "./ExerciseRow";

type SetType = {
  id: number;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
};
type ExerciseType = {
  id: number;
  name: string;
  sets: SetType[];
};
type WorkoutType = {
  id: number;
  date: string;
  exercises: ExerciseType[];
};

type WorkoutGridProps = {
  workout: WorkoutType | null;
  loading: boolean;
  isEditable: boolean;
  addExercise: (name: string) => Promise<void>;
  addSet: (exerciseId: number) => Promise<void>;
  updateSetField: (setId: number, field: keyof SetType, value: number | null) => Promise<void>;
  deleteSet: (setId: number, exerciseId: number) => Promise<void>;
  deleteExercise: (exerciseId: number) => Promise<void>;
  editingExerciseId: number | null;
  exerciseNameDraft: string;
  startEditExercise: (exercise: ExerciseType) => void;
  saveExerciseName: (exerciseId: number) => Promise<void>;
  setExerciseNameDraft: (name: string) => void;
  setEditingExerciseId: (id: number | null) => void;
};

export default function WorkoutGrid({
  workout,
  loading,
  isEditable,
  addExercise,
  addSet,
  updateSetField,
  deleteSet,
  deleteExercise,
  editingExerciseId,
  exerciseNameDraft,
  startEditExercise,
  saveExerciseName,
  setExerciseNameDraft,
  setEditingExerciseId,
}: WorkoutGridProps) {
  // --- Autocomplete states ---
  const [pastNames, setPastNames] = useState<string[]>([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  useEffect(() => {
    fetch('/api/exercises/names')
      .then(res => res.json())
      .then(setPastNames);
  }, []);

  const suggestions = pastNames.filter(
    name =>
      name.toLowerCase().includes(newExerciseName.toLowerCase()) &&
      name.toLowerCase() !== newExerciseName.toLowerCase()
  ).slice(0, 8);

  // --- Render ---
  if (loading || !workout) return <div>Loading workout...</div>;

  return (
    <div>
      {/* Add Exercise with autocomplete */}
      <div className="flex flex-col gap-1 mb-4 relative w-full max-w-md">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newExerciseName}
            onChange={e => {
              setNewExerciseName(e.target.value);
              setShowSuggestions(true);
              setHighlightIdx(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            placeholder="New exercise name"
            className="border px-2 py-1 rounded w-full"
            disabled={!isEditable}
            onKeyDown={e => {
              if (!suggestions.length) return;
              if (e.key === "ArrowDown") {
                setHighlightIdx(i => (i + 1) % suggestions.length);
              } else if (e.key === "ArrowUp") {
                setHighlightIdx(i => (i - 1 + suggestions.length) % suggestions.length);
              } else if (e.key === "Enter" && highlightIdx >= 0) {
                setNewExerciseName(suggestions[highlightIdx]);
                setShowSuggestions(false);
                setHighlightIdx(-1);
                e.preventDefault();
              }
            }}
          />
          <button
            onClick={async () => {
              if (newExerciseName.trim()) {
                await addExercise(newExerciseName);
                setNewExerciseName("");
                setShowSuggestions(false);
              }
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            disabled={!isEditable}
          >
            Add Exercise
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-10 bg-white border rounded shadow z-10 max-h-48 overflow-auto">
            {suggestions.map((name, idx) => (
              <li
                key={name}
                className={`px-3 py-1 cursor-pointer ${
                  highlightIdx === idx ? "bg-blue-200" : "hover:bg-blue-100"
                }`}
                style={{ color: "#111" }}
                onMouseDown={() => {
                  setNewExerciseName(name);
                  setShowSuggestions(false);
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {workout.exercises.length === 0 && <p>No exercises yet for this day.</p>}

      {workout.exercises.map(exercise => (
        <ExerciseRow
          key={exercise.id}
          exercise={exercise}
          isEditable={isEditable}
          editingExerciseId={editingExerciseId}
          exerciseNameDraft={exerciseNameDraft}
          startEditExercise={startEditExercise}
          saveExerciseName={saveExerciseName}
          setExerciseNameDraft={setExerciseNameDraft}
          setEditingExerciseId={setEditingExerciseId}
          deleteExercise={deleteExercise}
          addSet={addSet}
          updateSetField={updateSetField}
          deleteSet={(id: number) => deleteSet(id, exercise.id)}
        />
      ))}
    </div>
  );
}
