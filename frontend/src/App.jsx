import { useEffect, useState } from "react";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";
import StatsBar from "./components/StatsBar";
import MembersPanel from "./components/MembersPanel";
import Login from "./components/Login";
import Toast from "./components/Toast";

const API_URL = "https://habitcabin-1.onrender.com/api";

function App() {
  const [habits, setHabits] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [emoji, setEmoji] = useState("🔥");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Load user from localStorage on first mount
  useEffect(() => {
    const savedUser = localStorage.getItem("habitchain_user");
    const savedEmoji = localStorage.getItem("habitchain_emoji");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedEmoji) {
      setEmoji(savedEmoji);
    }
  }, []);

  // Fetch data when user is available
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [habitsRes, membersRes] = await Promise.all([
          fetch(`${API_URL}/habits?userId=${user.id}`),
          fetch(`${API_URL}/members?userId=${user.id}`),
        ]);

        const habitsData = await habitsRes.json();
        const membersData = await membersRes.json();

        setHabits(habitsData);
        setMembers(membersData);
      } catch (err) {
        console.error("Failed to load data", err);
        showToast("Failed to load data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Login with email (calls backend)
  const handleLogin = async ({ name, email, emoji: chosenEmoji }) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        showToast("Login failed", "error");
        return;
      }

      const userFromServer = await res.json();
      setUser(userFromServer);
      setEmoji(chosenEmoji);

      localStorage.setItem(
        "habitchain_user",
        JSON.stringify(userFromServer)
      );
      localStorage.setItem("habitchain_emoji", chosenEmoji);

      showToast(`Welcome, ${userFromServer.name}!`, "success");
    } catch (err) {
      console.error("Login error", err);
      showToast("Login error", "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setHabits([]);
    setMembers([]);
    localStorage.removeItem("habitchain_user");
    // we keep emoji, but you can clear if you want
    showToast("Logged out", "info");
  };

  // Add habit (attach userId)
  const handleAddHabit = async (habitData) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...habitData, userId: user.id }),
      });
      const newHabit = await res.json();
      setHabits((prev) => [...prev, newHabit]);
      showToast("Habit added ✅", "success");
    } catch (err) {
      console.error("Failed to add habit", err);
      showToast("Failed to add habit", "error");
    }
  };

  // Mark habit done
  const handleMarkDone = async (id) => {
    try {
      const res = await fetch(`${API_URL}/habits/${id}/done`, {
        method: "PATCH",
      });
      const updated = await res.json();
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
      showToast("Nice! Streak updated 🔥", "success");
    } catch (err) {
      console.error("Failed to mark habit done", err);
      showToast("Failed to update streak", "error");
    }
  };

  // Delete habit
  const handleDeleteHabit = async (id) => {
    try {
      await fetch(`${API_URL}/habits/${id}`, { method: "DELETE" });
      setHabits((prev) => prev.filter((h) => h.id !== id));
      showToast("Habit deleted", "info");
    } catch (err) {
      console.error("Failed to delete habit", err);
      showToast("Failed to delete habit", "error");
    }
  };

  // Add member
  const handleAddMember = async (memberData) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...memberData, userId: user.id }),
      });
      const newMember = await res.json();
      setMembers((prev) => [...prev, newMember]);
      showToast("Member added 👥", "success");
    } catch (err) {
      console.error("Failed to add member", err);
      showToast("Failed to add member", "error");
    }
  };

  const handleFabClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If user not logged in, show login screen only
  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toast message={toast?.msg} type={toast?.type || "info"} />
      </>
    );
  }

  return (
    <>
      <div className="app-shell fade-in">
        <header className="app-header">
          <div>
            <div className="app-title">
              HabitChain
              <span className="app-title-badge">beta</span>
            </div>
            <p className="app-subtitle">
              Build streaks, stay accountable, and share your progress.
            </p>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
            <div>
              {emoji} <strong>{user.name}</strong>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {user.email}
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-small"
              style={{ marginTop: "0.35rem" }}
            >
              Logout
            </button>
          </div>
        </header>

        <StatsBar habits={habits} />

        <MembersPanel members={members} onAddMember={handleAddMember} />

        <div className="section-glass">
          <HabitForm onAddHabit={handleAddHabit} />
        </div>

        {isLoading ? (
          <p className="text-muted">Loading your habits...</p>
        ) : (
          <HabitList
            habits={habits}
            onMarkDone={handleMarkDone}
            onDeleteHabit={handleDeleteHabit}
          />
        )}
      </div>

      <button className="btn-fab" onClick={handleFabClick}>
        ➕ Add new habit
      </button>

      <Toast message={toast?.msg} type={toast?.type || "info"} />
    </>
  );
}

export default App;
