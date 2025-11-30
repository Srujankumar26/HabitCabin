import { useState } from "react";

function HabitForm({ onAddHabit }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Health");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddHabit({ name, category });
    setName("");
  };

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder='New habit e.g. "Code 1 hour"'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="select"
      >
        <option>Health</option>
        <option>Study</option>
        <option>Career</option>
        <option>Personal</option>
        <option>Other</option>
      </select>
      <button type="submit" className="btn btn-primary">
        + Add habit
      </button>
    </form>
  );
}

export default HabitForm;
