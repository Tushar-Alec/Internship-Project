import { useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const steps = [
  { id: 1, label: "Education",  description: "Your academic background" },
  { id: 2, label: "Skills & Interests",  description: "What you know & love" },
  { id: 3, label: "Career Goals", description: "Where you want to go" },
  { id: 4, label: "Preferences",  description: "Your work style" },
];

const getToken = () => localStorage.getItem("access_token");


function Step1({ onNext }) {
  const [entries, setEntries] = useState([
    { degree: "", field: "", institution: "", year: "", status: "completed" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (i, key, val) => {
    const updated = [...entries];
    updated[i][key] = val;
    setEntries(updated);
  };

  const addEntry = () =>
    setEntries([...entries, { degree: "", field: "", institution: "", year: "", status: "completed" }]);

  const removeEntry = (i) => setEntries(entries.filter((_, idx) => idx !== i));

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.patch(
        `${API_BASE}/profile/onboarding/1/`,
        { education: entries },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      onNext();
    } catch (e) {
      setError("Failed to save. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Education History</h2>
      <p style={styles.stepSubtitle}>Add your academic qualifications, completed or in progress.</p>

      {entries.map((entry, i) => (
        <div key={i} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Entry {i + 1}</span>
            {entries.length > 1 && (
              <button onClick={() => removeEntry(i)} style={styles.removeBtn}>✕ Remove</button>
            )}
          </div>
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Degree</label>
              <input style={styles.input} placeholder="e.g. Bachelor's" value={entry.degree}
                onChange={(e) => update(i, "degree", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Field of Study</label>
              <input style={styles.input} placeholder="e.g. Computer Science" value={entry.field}
                onChange={(e) => update(i, "field", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Institution</label>
              <input style={styles.input} placeholder="e.g. MIT" value={entry.institution}
                onChange={(e) => update(i, "institution", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Year</label>
              <input style={styles.input} placeholder="e.g. 2024" value={entry.year}
                onChange={(e) => update(i, "year", e.target.value)} />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <div style={styles.radioGroup}>
              {["completed", "ongoing", "planned"].map((s) => (
                <label key={s} style={styles.radioLabel}>
                  <input type="radio" name={`status-${i}`} value={s}
                    checked={entry.status === s}
                    onChange={() => update(i, "status", s)} />
                  <span style={{ marginLeft: 6, textTransform: "capitalize" }}>{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button onClick={addEntry} style={styles.addBtn}>+ Add Another</button>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.actions}>
        <button onClick={submit} disabled={loading} style={styles.primaryBtn}>
          {loading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}

const INTEREST_OPTIONS = [
  "Artificial Intelligence", "Web Development", "Data Science", "Cybersecurity",
  "Design", "Finance", "Marketing", "Entrepreneurship", "Healthcare",
  "Education", "Gaming", "Cloud Computing", "Mobile Apps", "Blockchain",
];

function Step2({ onNext, onBack }) {
  const [skills, setSkills] = useState([{ name: "", level: "beginner" }]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateSkill = (i, key, val) => {
    const updated = [...skills];
    updated[i][key] = val;
    setSkills(updated);
  };

  const toggleInterest = (item) =>
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.patch(
        `${API_BASE}/profile/onboarding/2/`,
        { skills, interests },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      onNext();
    } catch (e) {
      setError("Failed to save. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Skills & Interests</h2>
      <p style={styles.stepSubtitle}>Tell us what you're good at and what excites you.</p>

      <h3 style={styles.sectionLabel}>Your Skills</h3>
      {skills.map((skill, i) => (
        <div key={i} style={{ ...styles.card, padding: "14px 18px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input style={{ ...styles.input, flex: 1 }} placeholder="Skill name (e.g. Python)"
              value={skill.name} onChange={(e) => updateSkill(i, "name", e.target.value)} />
            <select style={{ ...styles.input, width: 160 }} value={skill.level}
              onChange={(e) => updateSkill(i, "level", e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {skills.length > 1 && (
              <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                style={styles.removeBtn}>✕</button>
            )}
          </div>
        </div>
      ))}
      <button onClick={() => setSkills([...skills, { name: "", level: "beginner" }])}
        style={styles.addBtn}>+ Add Skill</button>

      <h3 style={{ ...styles.sectionLabel, marginTop: 28 }}>Interests</h3>
      <p style={{ ...styles.stepSubtitle, marginTop: -8 }}>Select all that apply.</p>
      <div style={styles.tagGrid}>
        {INTEREST_OPTIONS.map((item) => (
          <button key={item} onClick={() => toggleInterest(item)}
            style={interests.includes(item) ? styles.tagActive : styles.tag}>
            {item}
          </button>
        ))}
      </div>

      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.actions}>
        <button onClick={onBack} style={styles.secondaryBtn}>← Back</button>
        <button onClick={submit} disabled={loading} style={styles.primaryBtn}>
          {loading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}


function Step3({ onNext, onBack }) {
  const [form, setForm] = useState({
    goal_type: "clear",
    target_role: "",
    career_goal: "",
    target_timeline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.patch(`${API_BASE}/profile/onboarding/3/`, form, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      onNext();
    } catch (e) {
      setError("Failed to save. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Career Goals</h2>
      <p style={styles.stepSubtitle}>Tell us where you want to go. It's okay if you're unsure.</p>

      <div style={styles.card}>
        <label style={styles.label}>How clear are you about your career path?</label>
        <div style={styles.goalTypeGrid}>
          {[
            { value: "clear", emoji: "🎯", title: "I know what I want", desc: "I have a specific role or field in mind" },
            { value: "confused", emoji: "🤔", title: "I need guidance", desc: "I'm not sure yet and need help exploring" },
          ].map((opt) => (
            <button key={opt.value} onClick={() => set("goal_type", opt.value)}
              style={form.goal_type === opt.value ? styles.goalCardActive : styles.goalCard}>
              <span style={{ fontSize: 28 }}>{opt.emoji}</span>
              <strong style={{ display: "block", marginTop: 8 }}>{opt.title}</strong>
              <span style={{ fontSize: 13, color: "#888", marginTop: 4, display: "block" }}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {form.goal_type === "clear" && (
        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>Target Role</label>
            <input style={styles.input} placeholder="e.g. Machine Learning Engineer"
              value={form.target_role} onChange={(e) => set("target_role", e.target.value)} />
          </div>
          <div style={{ ...styles.field, marginTop: 16 }}>
            <label style={styles.label}>Career Goal</label>
            <textarea style={{ ...styles.input, height: 80, resize: "vertical" }}
              placeholder="Describe what you want to achieve..."
              value={form.career_goal} onChange={(e) => set("career_goal", e.target.value)} />
          </div>
        </div>
      )}

      <div style={styles.card}>
        <label style={styles.label}>Target Timeline</label>
        <div style={styles.radioGroup}>
          {["6 months", "1 year", "2 years", "3+ years"].map((t) => (
            <label key={t} style={styles.radioLabel}>
              <input type="radio" name="timeline" value={t}
                checked={form.target_timeline === t}
                onChange={() => set("target_timeline", t)} />
              <span style={{ marginLeft: 6 }}>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.actions}>
        <button onClick={onBack} style={styles.secondaryBtn}>← Back</button>
        <button onClick={submit} disabled={loading} style={styles.primaryBtn}>
          {loading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}


function Step4({ onNext, onBack }) {
  const [form, setForm] = useState({
    location: "",
    preferred_work_type: "remote",
    budget: "free",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.patch(`${API_BASE}/profile/onboarding/4/`, form, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      onNext();
    } catch (e) {
      setError("Failed to save. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.stepTitle}>Your Preferences</h2>
      <p style={styles.stepSubtitle}>Help us tailor your roadmap to your situation.</p>

      <div style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Location</label>
          <input style={styles.input} placeholder="e.g. India, United States, Remote"
            value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
      </div>

      <div style={styles.card}>
        <label style={styles.label}>Preferred Work Type</label>
        <div style={styles.optionGrid}>
          {[
            { value: "remote", label: "🌐 Remote" },
            { value: "onsite", label: "🏢 On-site" },
            { value: "hybrid", label: "⚖️ Hybrid" },
          ].map((opt) => (
            <button key={opt.value} onClick={() => set("preferred_work_type", opt.value)}
              style={form.preferred_work_type === opt.value ? styles.optionActive : styles.option}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <label style={styles.label}>Learning Budget</label>
        <div style={styles.optionGrid}>
          {[
            { value: "free", label: "Free only" },
            { value: "low", label: "Under $100" },
            { value: "medium", label: "Under $500" },
            { value: "high", label: "No limit" },
          ].map((opt) => (
            <button key={opt.value} onClick={() => set("budget", opt.value)}
              style={form.budget === opt.value ? styles.optionActive : styles.option}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.actions}>
        <button onClick={onBack} style={styles.secondaryBtn}>← Back</button>
        <button onClick={submit} disabled={loading} style={styles.primaryBtn}>
          {loading ? "Saving..." : "Finish Setup →"}
        </button>
      </div>
    </div>
  );
}


function Complete() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111", marginBottom: 12 }}>
        You're all set!
      </h2>
      <p style={{ color: "#666", fontSize: 16, marginBottom: 32 }}>
        Your profile is complete. We're generating your personalized career roadmap.
      </p>
      <button style={styles.primaryBtn} onClick={() => window.location.href = "/dashboard"}>
        Go to Dashboard →
      </button>
    </div>
  );
}


export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const next = () => {
    if (currentStep === 4) setCompleted(true);
    else setCurrentStep((s) => s + 1);
  };
  const back = () => setCurrentStep((s) => s - 1);

  const renderStep = () => {
    if (completed) return <Complete />;
    switch (currentStep) {
      case 1: return <Step1 onNext={next} />;
      case 2: return <Step2 onNext={next} onBack={back} />;
      case 3: return <Step3 onNext={next} onBack={back} />;
      case 4: return <Step4 onNext={next} onBack={back} />;
    }
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>Pathwise</div>
        <p style={styles.sidebarTagline}>Your AI career guide</p>

        <div style={styles.stepList}>
          {steps.map((step) => {
            const isDone = currentStep > step.id || completed;
            const isActive = currentStep === step.id && !completed;
            return (
              <div key={step.id} style={styles.stepItem}>
                <div style={isDone ? styles.stepIconDone : isActive ? styles.stepIconActive : styles.stepIconIdle}>
                  {isDone ? "✓" : step.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#111" : isDone ? "#555" : "#aaa"
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#bbb", marginTop: 2 }}>
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!completed && (
          <div style={styles.progressWrap}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#888" }}>Progress</span>
              <span style={{ fontSize: 12, color: "#888" }}>{Math.round(((currentStep - 1) / 4) * 100)}%</span>
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${((currentStep - 1) / 4) * 100}%` }} />
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          {!completed && (
            <div style={styles.stepBadge}>Step {currentStep} of 4</div>
          )}
          {renderStep()}
        </div>
      </main>
    </div>
  );
}


const styles = {
  page: {
    display: "flex", minHeight: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    backgroundColor: "#fafafa",
  },
  sidebar: {
    width: 280, minHeight: "100vh",
    backgroundColor: "#fff",
    borderRight: "1px solid #ebebeb",
    padding: "40px 28px",
    display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh",
  },
  logo: {
    fontSize: 22, fontWeight: 800, color: "#111",
    letterSpacing: "-0.5px",
  },
  sidebarTagline: {
    fontSize: 13, color: "#aaa", marginTop: 4, marginBottom: 40,
  },
  stepList: { display: "flex", flexDirection: "column", gap: 24, flex: 1 },
  stepItem: { display: "flex", alignItems: "flex-start", gap: 14 },
  stepIconIdle: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#f5f5f5", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: 16, flexShrink: 0,
  },
  stepIconActive: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#111", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: 16, flexShrink: 0,
  },
  stepIconDone: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 700, flexShrink: 0,
  },
  progressWrap: { marginTop: "auto", paddingTop: 32 },
  progressBar: {
    height: 4, backgroundColor: "#f0f0f0",
    borderRadius: 2, overflow: "hidden",
  },
  progressFill: {
    height: "100%", backgroundColor: "#111",
    borderRadius: 2, transition: "width 0.4s ease",
  },
  main: {
    flex: 1, display: "flex",
    justifyContent: "center", alignItems: "flex-start",
    padding: "60px 40px",
    overflowY: "auto",
  },
  content: { width: "100%", maxWidth: 640 },
  stepBadge: {
    display: "inline-block", fontSize: 12, fontWeight: 600,
    color: "#888", backgroundColor: "#f5f5f5",
    padding: "4px 12px", borderRadius: 20, marginBottom: 20,
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  stepTitle: {
    fontSize: 26, fontWeight: 700, color: "#111",
    marginBottom: 8, marginTop: 0,
  },
  stepSubtitle: { fontSize: 15, color: "#888", marginBottom: 28, marginTop: 0 },
  sectionLabel: { fontSize: 15, fontWeight: 600, color: "#333", marginBottom: 12 },
  card: {
    backgroundColor: "#fff", border: "1px solid #ebebeb",
    borderRadius: 12, padding: "20px 22px", marginBottom: 16,
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },
  cardLabel: { fontSize: 13, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  field: { display: "flex", flexDirection: "column" },
  label: { fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 },
  input: {
    border: "1px solid #e5e5e5", borderRadius: 8,
    padding: "10px 12px", fontSize: 14, color: "#111",
    outline: "none", backgroundColor: "#fff",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  radioGroup: { display: "flex", gap: 20, marginTop: 4 },
  radioLabel: { display: "flex", alignItems: "center", fontSize: 14, color: "#444", cursor: "pointer" },
  tagGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: {
    padding: "7px 14px", borderRadius: 20, fontSize: 13,
    border: "1px solid #e5e5e5", backgroundColor: "#fff",
    cursor: "pointer", color: "#555", transition: "all 0.15s",
  },
  tagActive: {
    padding: "7px 14px", borderRadius: 20, fontSize: 13,
    border: "1px solid #111", backgroundColor: "#111",
    cursor: "pointer", color: "#fff", transition: "all 0.15s",
  },
  goalTypeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 },
  goalCard: {
    padding: "20px 16px", borderRadius: 10,
    border: "1px solid #e5e5e5", backgroundColor: "#fff",
    cursor: "pointer", textAlign: "center", transition: "all 0.15s",
  },
  goalCardActive: {
    padding: "20px 16px", borderRadius: 10,
    border: "2px solid #111", backgroundColor: "#fafafa",
    cursor: "pointer", textAlign: "center", transition: "all 0.15s",
  },
  optionGrid: { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" },
  option: {
    padding: "9px 18px", borderRadius: 8, fontSize: 14,
    border: "1px solid #e5e5e5", backgroundColor: "#fff",
    cursor: "pointer", color: "#555", transition: "all 0.15s",
  },
  optionActive: {
    padding: "9px 18px", borderRadius: 8, fontSize: 14,
    border: "1px solid #111", backgroundColor: "#111",
    cursor: "pointer", color: "#fff", transition: "all 0.15s",
  },
  addBtn: {
    fontSize: 13, color: "#555", backgroundColor: "transparent",
    border: "1px dashed #ccc", borderRadius: 8,
    padding: "8px 16px", cursor: "pointer", marginBottom: 20,
  },
  removeBtn: {
    fontSize: 12, color: "#e53935", backgroundColor: "transparent",
    border: "none", cursor: "pointer", padding: "2px 6px",
  },
  actions: { display: "flex", justifyContent: "space-between", marginTop: 24 },
  primaryBtn: {
    padding: "11px 28px", borderRadius: 8, fontSize: 14,
    fontWeight: 600, backgroundColor: "#111", color: "#fff",
    border: "none", cursor: "pointer", marginLeft: "auto",
  },
  secondaryBtn: {
    padding: "11px 20px", borderRadius: 8, fontSize: 14,
    fontWeight: 500, backgroundColor: "transparent", color: "#555",
    border: "1px solid #e5e5e5", cursor: "pointer",
  },
  error: { color: "#e53935", fontSize: 13, marginTop: 8 },
};