'use client';
import { useEffect, useState } from "react";

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

export default function WorkoutGrid() {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [loading, setLoading] = useState(true);
  const [newExerciseName, setNewExerciseName] = useState("");

  // Fetch today's workout on mount
  useEffect(() => {
    fetch('/api/workouts/today')
      .then(res => res.json())
      .then(data => {
        setWorkout(data);
        setLoading(false);
      });
  }, []);

  // Add a new exercise to today's workout
  const addExercise = async () => {
    if (!workout || !newExerciseName.trim()) return;
    const res = await fetch('/api/exercises', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workoutId: workout.id, name: newExerciseName }),
    });
    const exercise = await res.json();
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, { ...exercise, sets: [] }],
    });
    setNewExerciseName("");
  };

  // Add a new set to an exercise
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

  // Update a field in a set (weight, reps, rpe)
  const updateSetField = async (
    setId: number,
    field: keyof SetType,
    value: number
  ) => {
    if (!workout) return;
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

  if (loading || !workout) return <div>Loading...</div>;

  return (
    <main className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-6">Today’s Workout</h1>

      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          value={newExerciseName}
          onChange={e => setNewExerciseName(e.target.value)}
          placeholder="New exercise name"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={addExercise}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add Exercise
        </button>
      </div>

      {workout.exercises.length === 0 && <p>No exercises yet for today.</p>}

      {workout.exercises.map(exercise => (
        <div key={exercise.id} className="mb-6">
          <h3 className="font-bold mb-1">{exercise.name}</h3>
          <table className="w-full text-sm mb-2">
            <thead>
              <tr>
                <th className="border px-2 py-1">Set</th>
                <th className="border px-2 py-1">Weight</th>
                <th className="border px-2 py-1">Reps</th>
                <th className="border px-2 py-1">RPE</th>
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map(set => (
                <tr key={set.id}>
                  <td className="border px-2 py-1 text-center">{set.setNumber}</td>
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="number"
                      className="w-16 border rounded px-1"
                      value={set.weight}
                      onChange={e =>
                        updateSetField(set.id, "weight", parseFloat(e.target.value))
                      }
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="number"
                      className="w-16 border rounded px-1"
                      value={set.reps}
                      onChange={e =>
                        updateSetField(set.id, "reps", parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="number"
                      step="0.5"
                      className="w-16 border rounded px-1"
                      value={set.rpe}
                      onChange={e =>
                        updateSetField(set.id, "rpe", parseFloat(e.target.value))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => addSet(exercise.id)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mb-2"
          >
            + Add Set
          </button>
        </div>
      ))}
    </main>
  );
}
