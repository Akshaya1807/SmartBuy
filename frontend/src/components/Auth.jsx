
import axios from "axios";
import { useState } from "react";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
        );

        localStorage.setItem("token", response.data.token);
        onLogin();

      } else {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          { name, email, password }
        );

        setSuccess("Registration successful! Please login.");
        setIsLogin(true);
        setPassword("");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Create Account"}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setSuccess("");
          }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default Auth;
