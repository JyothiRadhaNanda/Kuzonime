import React, { useState, useEffect } from "react";

type LoginProps = {
  onLogin: (username: string, email: string, password: string) => void; // Ubah tipe untuk onLogin
};

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState(""); // State untuk username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, email, password); // Panggil onLogin dengan username, email, dan password
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
