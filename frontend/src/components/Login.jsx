import { useState } from "react";

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emoji, setEmoji] = useState("🔥");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return; // email required

    onLogin({ name, email, emoji });
  };

  return (
    <div className="login-shell fade-in">
      <div className="login-card">
        <div className="login-emoji">{emoji}</div>
        <h1 className="login-title">HabitChain</h1>
        <p className="login-subtitle">
          Login with your email to keep your own streak data.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <input
            type="email"
            placeholder="Email (required)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <select
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="select"
          >
            <option>🔥</option>
            <option>💪</option>
            <option>🚀</option>
            <option>🌱</option>
            <option>🎯</option>
            <option>📚</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Enter HabitChain
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
