"use client";
import React, { useState, useEffect } from "react";

type SetType = {
  id: number;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
};

type SetRowProps = {
  set: SetType;
  isEditable: boolean;
  updateSetField: (setId: number, field: keyof SetType, value: number | null) => Promise<void>;
  deleteSet: (setId: number) => Promise<void>;
};

export default function SetRow({ set, isEditable, updateSetField, deleteSet }: SetRowProps) {
  const [weightInput, setWeightInput] = useState(set.weight === null || set.weight === undefined ? "" : set.weight.toString());
  const [repsInput, setRepsInput] = useState(set.reps === null || set.reps === undefined ? "" : set.reps.toString());
  const [rpeInput, setRpeInput] = useState(set.rpe === null || set.rpe === undefined ? "" : set.rpe.toString());

  useEffect(() => {
    setWeightInput(set.weight === null || set.weight === undefined ? "" : set.weight.toString());
    setRepsInput(set.reps === null || set.reps === undefined ? "" : set.reps.toString());
    setRpeInput(set.rpe === null || set.rpe === undefined ? "" : set.rpe.toString());
  }, [set.weight, set.reps, set.rpe]);


  const commitField = (field: keyof SetType, value: string) => {
    // If the user leaves it blank, set to null
    if (value === "" || isNaN(Number(value))) {
      updateSetField(set.id, field, null);
      return;
    }
    updateSetField(set.id, field, Number(value));
  };


  return (
    <tr>
      <td className="border px-2 py-1 text-center">{set.setNumber}</td>
      <td className="border px-2 py-1 text-center">
        <input
          type="number"
          className="w-16 border rounded px-1"
          value={weightInput}
          min={0}
          placeholder="0"
          disabled={!isEditable}
          onChange={e => setWeightInput(e.target.value)}
          onBlur={() => commitField("weight", weightInput)}
          onKeyDown={e => {
            if (e.key === "Enter") commitField("weight", weightInput);
          }}
        />
      </td>
      <td className="border px-2 py-1 text-center">
        <input
          type="number"
          className="w-16 border rounded px-1"
          value={repsInput}
          min={0}
          placeholder="0"
          disabled={!isEditable}
          onChange={e => setRepsInput(e.target.value)}
          onBlur={() => commitField("reps", repsInput)}
          onKeyDown={e => {
            if (e.key === "Enter") commitField("reps", repsInput);
          }}
        />
      </td>
      <td className="border px-2 py-1 text-center">
        <input
          type="number"
          step="0.5"
          min={1}
          max={10}
          placeholder="1"
          className="w-16 border rounded px-1"
          value={rpeInput}
          disabled={!isEditable}
          onChange={e => setRpeInput(e.target.value)}
          onBlur={() => commitField("rpe", rpeInput)}
          onKeyDown={e => {
            if (e.key === "Enter") commitField("rpe", rpeInput);
          }}
        />
      </td>
      <td className="border px-2 py-1 text-center">
        <button
          onClick={() => isEditable && deleteSet(set.id)}
          className="text-red-500"
          title="Delete set"
          disabled={!isEditable}
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
