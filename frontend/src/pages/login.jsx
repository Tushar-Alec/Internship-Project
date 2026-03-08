import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      const profile = await axios.get("http://127.0.0.1:8000/api/profile/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      if (!profile.data.onboarding_completed) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
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
                <p className="text-muted mb-0">Please login to your account</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 rounded-3" role="alert">
                  {error}
                </div>
              )}

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
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Signing in...
                    </>
                  ) : "Sign In"}
                </button>
              </form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  Don't have an account?{" "}
                  <a href="/signup" className="fw-semibold text-decoration-none text-blue">
                    Create one
                  </a>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}