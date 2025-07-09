"use client";
import React from "react";

export type WorkoutSummary = {
  id: number;
  date: string;
  exerciseCount: number;
};

export type WorkoutHistoryToggleProps = {
  viewMode: "calendar" | "list";
  setViewMode: (mode: "calendar" | "list") => void;
  history: WorkoutSummary[];
  selectedWorkout: number | null;
  setSelectedWorkout: (id: number | null) => void;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function dateISO(date: Date) {
  return date.toISOString().split('T')[0];
}

function thisMonthDays() {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

function getYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export default function WorkoutHistoryToggle({
  viewMode,
  setViewMode,
  history,
  selectedWorkout,
  setSelectedWorkout,
}: WorkoutHistoryToggleProps) {
  const { year, month } = getYearMonth();
  const daysInMonth = thisMonthDays();
  const workoutsByDate = Object.fromEntries(
    history.map(w => [dateISO(new Date(w.date)), w])
  );

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${viewMode === "calendar" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          onClick={() => setViewMode('calendar')}
        >
          Calendar
        </button>
        <button
          className={`px-4 py-2 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          onClick={() => setViewMode('list')}
        >
          List
        </button>
      </div>

      {viewMode === 'calendar' && (
        <div className="mb-8">
          <div className="mb-2 font-medium">{new Date(year, month).toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
          <div className="grid grid-cols-7 gap-1 border rounded p-2 bg-gray-50">
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dateObj = new Date(year, month, i + 1);
              const isoStr = dateISO(dateObj);
              const workout = workoutsByDate[isoStr];
              const isToday = dateISO(new Date()) === isoStr;
              return (
                <button
                  key={i}
                  className={`h-12 w-full rounded border text-sm flex flex-col items-center justify-center ${workout ? "bg-blue-200" : "bg-white"} ${isToday ? "ring-2 ring-blue-400" : ""}`}
                  onClick={() => workout && setSelectedWorkout(workout.id)}
                  disabled={!workout}
                  title={workout ? formatDate(workout.date) : ""}
                >
                  <span>{i + 1}</span>
                  {workout && (
                    <span className="text-xs text-gray-600">{workout.exerciseCount} ex</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <ul className="mb-8 max-h-64 overflow-y-auto border rounded bg-gray-50">
          {history.length === 0 && <li className="p-2">No workouts yet.</li>}
          {history.map(w => (
            <li
              key={w.id}
              className={`p-2 border-b cursor-pointer hover:bg-blue-50 ${selectedWorkout === w.id ? "bg-blue-100" : ""}`}
              onClick={() => setSelectedWorkout(w.id)}
            >
              {formatDate(w.date)}{" "}
              <span className="text-xs text-gray-500">({w.exerciseCount} exercises)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
