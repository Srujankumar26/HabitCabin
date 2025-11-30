// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ===================
// File persistence
// ===================
const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { users: [], habits: [], members: [] };
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    if (!raw) return { users: [], habits: [], members: [] };
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load data.json, starting fresh:", err);
    return { users: [], habits: [], members: [] };
  }
}

let { users = [], habits = [], members = [] } = loadData();

let nextUserId =
  users.reduce((max, u) => Math.max(max, u.id || 0), 0) + 1;
let nextHabitId =
  habits.reduce((max, h) => Math.max(max, h.id || 0), 0) + 1;
let nextMemberId =
  members.reduce((max, m) => Math.max(max, m.id || 0), 0) + 1;

function saveData() {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ users, habits, members }, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Failed to save data.json:", err);
  }
}

// Utility: today's date as YYYY-MM-DD
function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// Make sure older habits have history array
habits = habits.map((h) => ({
  history: [],
  ...h,
}));

// ===================
// Auth / Login
// ===================

// Simple email-based login (creates user if not exists)
app.post("/api/login", (req, res) => {
  let { name, email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  email = email.trim().toLowerCase();
  name = (name && name.trim()) || email.split("@")[0];

  let user = users.find((u) => u.email === email);

  if (user) {
    // Optionally update name
    if (name && name !== user.name) {
      user.name = name;
      saveData();
    }
  } else {
    user = {
      id: nextUserId++,
      name,
      email,
    };
    users.push(user);
    saveData();
  }

  res.json(user);
});

// ===================
// Habits API (per-user)
// ===================

// GET /api/habits?userId=1
app.get("/api/habits", (req, res) => {
  const userId = Number(req.query.userId);
  if (!userId) {
    // No userId provided → no data
    return res.json([]);
  }
  const userHabits = habits.filter((h) => h.userId === userId);
  res.json(userHabits);
});

// POST create habit for a user
app.post("/api/habits", (req, res) => {
  const { name, category, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Habit name is required" });
  }

  const newHabit = {
    id: nextHabitId++,
    userId,
    name: name.trim(),
    category: category || "General",
    currentStreak: 0,
    longestStreak: 0,
    lastDoneDate: null,
    history: [],
  };

  habits.push(newHabit);
  saveData();
  res.status(201).json(newHabit);
});

// PATCH mark habit as done for today
app.patch("/api/habits/:id/done", (req, res) => {
  const id = Number(req.params.id);
  const today = getToday();

  const habit = habits.find((h) => h.id === id);
  if (!habit) {
    return res.status(404).json({ message: "Habit not found" });
  }

  if (habit.lastDoneDate === today) {
    // already counted for today
    return res.json(habit);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (habit.lastDoneDate === yesterdayStr) {
    habit.currentStreak += 1;
  } else {
    habit.currentStreak = 1;
  }

  if (habit.currentStreak > habit.longestStreak) {
    habit.longestStreak = habit.currentStreak;
  }

  habit.lastDoneDate = today;

  if (!habit.history) habit.history = [];
  if (!habit.history.includes(today)) {
    habit.history.push(today);
  }

  saveData();
  res.json(habit);
});

// DELETE habit
app.delete("/api/habits/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = habits.length;
  habits = habits.filter((h) => h.id !== id);

  if (habits.length === before) {
    return res.status(404).json({ message: "Habit not found" });
  }

  saveData();
  res.status(204).send();
});

// ===================
// Members API (per-user)
// ===================

// GET /api/members?userId=1
app.get("/api/members", (req, res) => {
  const userId = Number(req.query.userId);
  if (!userId) {
    return res.json([]);
  }
  const userMembers = members.filter((m) => m.userId === userId);
  res.json(userMembers);
});

// POST create member
app.post("/api/members", (req, res) => {
  const { name, relation, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Member name is required" });
  }

  const newMember = {
    id: nextMemberId++,
    userId,
    name: name.trim(),
    relation: relation || "Friend",
  };

  members.push(newMember);
  saveData();
  res.status(201).json(newMember);
});

// DELETE member
app.delete("/api/members/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = members.length;
  members = members.filter((m) => m.id !== id);

  if (members.length === before) {
    return res.status(404).json({ message: "Member not found" });
  }

  saveData();
  res.status(204).send();
});

// ===================
// Start server
// ===================
app.listen(PORT, () => {
  console.log(`HabitChain backend running on http://localhost:${PORT}`);
});
