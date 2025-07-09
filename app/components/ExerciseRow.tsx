"use client";
import React from "react";
import SetRow from "./SetRow";

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

type ExerciseRowProps = {
  exercise: ExerciseType;
  isEditable: boolean;
  editingExerciseId: number | null;
  exerciseNameDraft: string;
  startEditExercise: (exercise: ExerciseType) => void;
  saveExerciseName: (exerciseId: number) => Promise<void>;
  setExerciseNameDraft: (name: string) => void;
  setEditingExerciseId: (id: number | null) => void;
  deleteExercise: (exerciseId: number) => Promise<void>;
  addSet: (exerciseId: number) => Promise<void>;
  updateSetField: (setId: number, field: keyof SetType, value: number) => Promise<void>;
  deleteSet: (setId: number) => Promise<void>;
};

export default function ExerciseRow({
  exercise,
  isEditable,
  editingExerciseId,
  exerciseNameDraft,
  startEditExercise,
  saveExerciseName,
  setExerciseNameDraft,
  setEditingExerciseId,
  deleteExercise,
  addSet,
  updateSetField,
  deleteSet,
}: ExerciseRowProps) {
  return (
    <div className="mb-6 border-b pb-4">
      <div className="flex items-center gap-2 mb-1">
        {editingExerciseId === exercise.id ? (
          <>
            <input
              type="text"
              value={exerciseNameDraft}
              onChange={e => setExerciseNameDraft(e.target.value)}
              className="border px-2 py-1 rounded"
              onKeyDown={e => {
                if (e.key === "Enter") saveExerciseName(exercise.id);
                if (e.key === "Escape") {
                  setEditingExerciseId(null);
                  setExerciseNameDraft("");
                }
              }}
              autoFocus
              disabled={!isEditable}
            />
            <button
              onClick={() => saveExerciseName(exercise.id)}
              className="text-green-600 font-bold"
              title="Save"
              disabled={!isEditable}
            >
              ✓
            </button>
            <button
              onClick={() => {
                setEditingExerciseId(null);
                setExerciseNameDraft("");
              }}
              className="text-gray-400"
              title="Cancel"
              disabled={!isEditable}
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <h3
              className="font-bold cursor-pointer hover:underline"
              onClick={() => isEditable && startEditExercise(exercise)}
              title="Click to edit name"
            >
              {exercise.name}
            </h3>
            <button
              onClick={() => isEditable && deleteExercise(exercise.id)}
              className="text-red-500 ml-2"
              title="Delete exercise"
              disabled={!isEditable}
            >
              ✕
            </button>
          </>
        )}
      </div>
      <table className="w-full text-sm mb-2">
        <thead>
          <tr>
            <th className="border px-2 py-1">Set</th>
            <th className="border px-2 py-1">Weight</th>
            <th className="border px-2 py-1">Reps</th>
            <th className="border px-2 py-1">RPE</th>
            <th className="border px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {exercise.sets.map(set => (
            <SetRow
              key={set.id}
              set={set}
              isEditable={isEditable}
              updateSetField={updateSetField}
              deleteSet={(id: number) => deleteSet(id)}
            />
          ))}
        </tbody>
      </table>
      <button
        onClick={() => isEditable && addSet(exercise.id)}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mb-2"
        disabled={!isEditable}
      >
        + Add Set
      </button>
    </div>
  );
}
