import HabitCard from "./HabitCard";

function HabitList({ habits, onMarkDone, onDeleteHabit }) {
  if (!habits.length) {
    return (
      <p className="text-muted">
        No habits yet. Start by adding one above and build your first streak ✨
      </p>
    );
  }

  return (
    <div className="habit-grid">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onMarkDone={onMarkDone}
          onDeleteHabit={onDeleteHabit}
        />
      ))}
    </div>
  );
}

export default HabitList;
