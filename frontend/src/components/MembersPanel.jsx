import { useState } from "react";

function MembersPanel({ members, onAddMember }) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Friend");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMember({ name, relation });
    setName("");
  };

  const label =
    members.length === 0
      ? "You haven’t added anyone yet. Add a friend or family member who can see your progress."
      : `Currently shared with: ${members
          .map((m) => `${m.name} (${m.relation})`)
          .join(", ")}`;

  return (
    <section className="section-glass">
      <div className="panel-header">
        <div>
          <div className="panel-title">👥 Shared with</div>
          <p className="panel-sub">{label}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}
      >
        <input
          type="text"
          placeholder="Name e.g. Mom, Rahul..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <select
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          className="select"
        >
          <option>Friend</option>
          <option>Mother</option>
          <option>Father</option>
          <option>Sibling</option>
          <option>Partner</option>
          <option>Coach</option>
          <option>Other</option>
        </select>
        <button type="submit" className="btn btn-pill-muted">
          + Add member
        </button>
      </form>
    </section>
  );
}

export default MembersPanel;
