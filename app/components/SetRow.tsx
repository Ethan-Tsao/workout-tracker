"use client";
import React from "react";

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
  updateSetField: (setId: number, field: keyof SetType, value: number) => Promise<void>;
  deleteSet: (setId: number) => Promise<void>;
};

export default function SetRow({ set, isEditable, updateSetField, deleteSet }: SetRowProps) {
  return (
    <tr>
      <td className="border px-2 py-1 text-center">{set.setNumber}</td>
      <td className="border px-2 py-1 text-center">
        <input
          type="number"
          className="w-16 border rounded px-1"
          value={set.weight}
          min={0}
          disabled={!isEditable}
          onChange={e => {
            const val = parseFloat(e.target.value);
            if (val >= 0) updateSetField(set.id, "weight", val);
          }}
        />
      </td>
      <td className="border px-2 py-1 text-center">
        <input
          type="number"
          className="w-16 border rounded px-1"
          value={set.reps}
          min={0}
          disabled={!isEditable}
          onChange={e => {
            const val = parseInt(e.target.value);
            if (val >= 0) updateSetField(set.id, "reps", val);
          }}
        />
      </td>
      <td className="border px-2 py-1 text-center">
        <input
          type="number"
          step="0.5"
          min={1}
          max={10}
          className="w-16 border rounded px-1"
          value={set.rpe}
          disabled={!isEditable}
          onChange={e => {
            const val = parseFloat(e.target.value);
            if (val >= 1 && val <= 10) updateSetField(set.id, "rpe", val);
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
