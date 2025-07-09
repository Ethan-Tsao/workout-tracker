"use client";
import React, { useState } from "react";
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
  updateSetField: (setId: number, field: keyof SetType, value: number) => Promise<void>;
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
  const [newExerciseName, setNewExerciseName] = useState("");

  if (loading || !workout) return <div>Loading workout...</div>;

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          value={newExerciseName}
          onChange={e => setNewExerciseName(e.target.value)}
          placeholder="New exercise name"
          className="border px-2 py-1 rounded"
          disabled={!isEditable}
        />
        <button
          onClick={async () => {
            if (newExerciseName.trim()) {
              await addExercise(newExerciseName);
              setNewExerciseName("");
            }
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          disabled={!isEditable}
        >
          Add Exercise
        </button>
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
          deleteSet={(setId) => deleteSet(setId, exercise.id)}
        />
      ))}
    </div>
  );
}
