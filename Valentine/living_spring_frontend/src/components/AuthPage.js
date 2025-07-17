import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage({ setUsername }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "signup";

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ VERY important
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        if (isLogin) {
          localStorage.setItem("loggedInUser", username);
          setUsername?.(username); // optional: set it in parent
          navigate("/"); // ✅ redirect to Home
        } else {
          setIsLogin(true); // go to login form
        }
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setLocalUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "blue" }}>
        {isLogin ? "No account? Sign up" : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default AuthPage;
