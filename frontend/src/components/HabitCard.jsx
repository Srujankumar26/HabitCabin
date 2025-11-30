function HabitCard({ habit, onMarkDone, onDeleteHabit }) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const isDoneToday = habit.lastDoneDate === todayStr;
  const history = new Set(habit.history || []);

  // last 7 days including today
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ key, isToday: key === todayStr, done: history.has(key) });
  }

  return (
    <article className={`card ${isDoneToday ? "done-animation" : ""}`}>
      <h3 className="habit-name">{habit.name}</h3>

      <p className="habit-meta">Category: {habit.category}</p>

      <div className="habit-streak-row">
        <span>
          Current streak: <strong>{habit.currentStreak}</strong>
        </span>
        <span>
          Longest: <strong>{habit.longestStreak}</strong>
        </span>
        {habit.currentStreak > 0 && (
          <span className="habit-streak-badge">🔥 on a roll</span>
        )}
      </div>

      {/* mini calendar */}
      <div className="streak-calendar">
        {days.map((d) => (
          <div
            key={d.key}
            className={[
              "streak-dot",
              d.done ? "streak-dot--active" : "",
              d.isToday ? "streak-dot--today" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
        <span className="streak-calendar-label">Last 7 days</span>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
        <button
          onClick={() => onMarkDone(habit.id)}
          disabled={isDoneToday}
          className="btn btn-primary btn-small"
        >
          {isDoneToday ? "Done for today ✅" : "Mark done today"}
        </button>

        <button
          onClick={() => onDeleteHabit(habit.id)}
          className="btn btn-ghost btn-small"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default HabitCard;
