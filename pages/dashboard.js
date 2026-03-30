"use client";

import { useState } from "react";

export default function Dashboard() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate options before sending
    if (options.some(opt => !opt.trim()) || !correctOption.trim()) {
      setMessage("All options and correct option are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/questions", { // <-- correct plural route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, question, options, correctOption }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Question added successfully!");
        // Clear form
        setSubject("");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectOption("");
      } else {
        setMessage(data.message || "Failed to add question.");
      }
    } catch (err) {
      console.error("Error submitting question:", err);
      setMessage("Database connection failed. Please check your setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add Question</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <br />
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
          />
        ))}
        <br />
        {/* Make correct option a dropdown to avoid mismatches */}
        <select
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          required
        >
          <option value="" disabled>Select Correct Option</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
          ))}
        </select>
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
