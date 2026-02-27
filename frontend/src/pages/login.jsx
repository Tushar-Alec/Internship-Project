import { useState } from "react";
import { loginUser } from "../api/auth";

export default function Login() {
 const [form, setForm] = useState({
  email: "",
  password: "",
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Login successful 🔥");
    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
  type="email"
  name="email"
  placeholder="Email"
  onChange={handleChange}
/>

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}