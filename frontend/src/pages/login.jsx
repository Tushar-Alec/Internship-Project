import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/profile");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
  <div className="bg-light min-vh-100 d-flex align-items-center">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 rounded-4 p-4">
            
            <div className="text-center mb-4">
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted mb-0">
                Please login to your account
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control rounded-3"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                />
                <label>Email address</label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  name="password"
                  className="form-control rounded-3"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 py-2 rounded-3"
              >
                Sign In
              </button>
            </form>

            <div className="text-center mt-4">
              <small className="text-muted">
                Don’t have an account?{" "}
                <a href="/signup" className="fw-semibold text-decoration-none">
                  Create one
                </a>
              </small>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
)};