"use client";

import { useState } from "react";

export default function Dashboard() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, question, options, correctOption }),
    });

    const data = await res.json();
    setMessage(data.message);

    // Clear form if success
    if (data.success) {
      setSubject("");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption("");
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
        <input
          type="text"
          placeholder="Correct Option"
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add Question</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
