function StatsBar({ habits }) {
  const today = new Date().toISOString().slice(0, 10);
  const totalHabits = habits.length;
  const doneToday = habits.filter((h) => h.lastDoneDate === today).length;
  const streakSum = habits.reduce(
    (sum, h) => sum + (h.currentStreak || 0),
    0
  );

  return (
    <div className="stats-bar">
      <div className="stats-pill">
        <span className="stats-pill-icon">📦</span>
        <span className="stats-pill-value">{totalHabits}</span>
        <span className="stats-pill-label">Total habits</span>
      </div>
      <div className="stats-pill">
        <span className="stats-pill-icon">🔥</span>
        <span className="stats-pill-value">{doneToday}</span>
        <span className="stats-pill-label">Done today</span>
      </div>
      <div className="stats-pill">
        <span className="stats-pill-icon">🏆</span>
        <span className="stats-pill-value">{streakSum}</span>
        <span className="stats-pill-label">Total streaks</span>
      </div>
    </div>
  );
}

export default StatsBar;
