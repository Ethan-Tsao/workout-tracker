'use client';
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import components
const WorkoutHistoryToggle = dynamic(() => import("./components/WorkoutHistoryToggle"), { ssr: false });
const WorkoutGrid = dynamic(() => import("./components/WorkoutGrid"), { ssr: false });

// --- Type Definitions ---
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
type WorkoutSummary = {
  id: number;
  date: string;
  exerciseCount: number;
};

export default function Page() {
  // --- State ---
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [history, setHistory] = useState<WorkoutSummary[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [loading, setLoading] = useState(true);

  // Grid-related state
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);
  const [exerciseNameDraft, setExerciseNameDraft] = useState("");

  // --- Fetch Workout History on Mount ---
  useEffect(() => {
    fetch('/api/workouts/history')
      .then(res => res.json())
      .then(setHistory);
  }, []);

  // --- Load Selected Workout or Today's ---
  useEffect(() => {
    const endpoint = selectedWorkout
      ? `/api/workouts/${selectedWorkout}`
      : '/api/workouts/today';
    setLoading(true);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setWorkout(data);
        setLoading(false);
      });
  }, [selectedWorkout]);

  // --- Action Functions ---
  const addExercise = async (name: string) => {
    if (!workout || !name.trim()) return;
    const res = await fetch('/api/exercises', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workoutId: workout.id, name }),
    });
    const exercise = await res.json();
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, { ...exercise, sets: [] }],
    });
    fetch('/api/workouts/history').then(res => res.json()).then(setHistory);
  };

  const addSet = async (exerciseId: number) => {
    if (!workout) return;
    const exercise = workout.exercises.find(e => e.id === exerciseId);
    const nextSetNumber = exercise ? (exercise.sets.length + 1) : 1;
    const res = await fetch('/api/sets', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId, setNumber: nextSetNumber }),
    });
    const newSet = await res.json();
    setWorkout(prev =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.map(ex =>
              ex.id === exerciseId
                ? { ...ex, sets: [...ex.sets, newSet] }
                : ex
            ),
          }
        : prev
    );
  };

  const updateSetField = async (
    setId: number,
    field: keyof SetType,
    value: number
  ) => {
    if (!workout) return;
    if ((field === "weight" || field === "reps") && value < 0) return;
    if (field === "rpe" && (value < 1 || value > 10)) return;
    setWorkout({
      ...workout,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(set =>
          set.id === setId ? { ...set, [field]: value } : set
        ),
      })),
    });
    await fetch(`/api/sets/${setId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  };

  const deleteSet = async (setId: number, exerciseId: number) => {
    await fetch(`/api/sets/${setId}`, { method: "DELETE" });
    setWorkout(prev =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.map(ex =>
              ex.id === exerciseId
                ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
                : ex
            ),
          }
        : prev
    );
  };

  const deleteExercise = async (exerciseId: number) => {
    await fetch(`/api/exercises/${exerciseId}`, { method: "DELETE" });
    setWorkout(prev =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
          }
        : prev
    );
    fetch('/api/workouts/history').then(res => res.json()).then(setHistory);
  };

  const startEditExercise = (exercise: ExerciseType) => {
    setEditingExerciseId(exercise.id);
    setExerciseNameDraft(exercise.name);
  };
  const saveExerciseName = async (exerciseId: number) => {
    if (!exerciseNameDraft.trim()) return;
    await fetch(`/api/exercises/${exerciseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: exerciseNameDraft }),
    });
    setWorkout(prev =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.map(ex =>
              ex.id === exerciseId ? { ...ex, name: exerciseNameDraft } : ex
            ),
          }
        : prev
    );
    setEditingExerciseId(null);
    setExerciseNameDraft("");
    fetch('/api/workouts/history').then(res => res.json()).then(setHistory);
  };

  // --- Render ---
  return (
    <main className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-4">Workout Tracker</h1>

      <WorkoutHistoryToggle
        viewMode={viewMode}
        setViewMode={setViewMode}
        history={history}
        selectedWorkout={selectedWorkout}
        setSelectedWorkout={setSelectedWorkout}
      />

      {selectedWorkout && (
        <button
          className="mb-4 text-blue-600 underline"
          onClick={() => setSelectedWorkout(null)}
        >
          Back to Today
        </button>
      )}

      <WorkoutGrid
        workout={workout}
        loading={loading}
        isEditable={!selectedWorkout || selectedWorkout === workout?.id}
        addExercise={addExercise}
        addSet={addSet}
        updateSetField={updateSetField}
        deleteSet={deleteSet}
        deleteExercise={deleteExercise}
        editingExerciseId={editingExerciseId}
        exerciseNameDraft={exerciseNameDraft}
        startEditExercise={startEditExercise}
        saveExerciseName={saveExerciseName}
        setExerciseNameDraft={setExerciseNameDraft}
        setEditingExerciseId={setEditingExerciseId}
      />
    </main>
  );
}
