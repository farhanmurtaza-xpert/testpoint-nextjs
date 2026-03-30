"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setQuestions(data.questions);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Questions</h1>
      {questions.map((q) => (
        <div key={q.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>{q.subject}</h3>
          <p>{q.question}</p>
          <ul>
            {q.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
          <p><strong>Correct: </strong>{q.correctOption}</p>
        </div>
      ))}
    </div>
  );
}
