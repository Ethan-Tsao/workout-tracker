import React, { useState } from "react";

export default function SetRow({ set, isEditable, updateSetField, deleteSet }) {
  // Local state for editing
  const [weightInput, setWeightInput] = useState(set.weight.toString());
  const [repsInput, setRepsInput] = useState(set.reps.toString());
  const [rpeInput, setRpeInput] = useState(set.rpe.toString());

  // When set changes (e.g., after save), update inputs
  React.useEffect(() => {
    setWeightInput(set.weight.toString());
    setRepsInput(set.reps.toString());
    setRpeInput(set.rpe.toString());
  }, [set.weight, set.reps, set.rpe]);

  // Helper to commit changes
  const commitField = (field, value) => {
    if (value === "" || isNaN(Number(value))) return;
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
          disabled={!isEditable}
          onChange={e => {
            setWeightInput(e.target.value);
          }}
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
