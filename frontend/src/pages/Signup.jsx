import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
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

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      await registerUser(form);

      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      alert("Signup failed");
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card border-0 rounded-4 p-4">
              
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted mb-0">
                  Please fill in the details to register
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control rounded-3"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                  />
                  <label>Full Name</label>
                </div>

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

                <div className="form-floating mb-1">
                  <input
                    type="password"
                    name="password"
                    className="form-control rounded-3"
                    placeholder="Password"
                    onChange={handleChange}
                    minLength={8}
                    required
                  />
                  <label>Password</label>
                </div>

                <div className="form-text mb-4">
                  Password must be at least 8 characters long.
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2 rounded-3"
                >
                  Create Account
                </button>
              </form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-none"
                  >
                    Sign In
                  </Link>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}