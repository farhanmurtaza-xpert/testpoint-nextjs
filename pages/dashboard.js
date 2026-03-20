import { useState, useEffect } from "react";

export default function Dashboard() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [questions, setQuestions] = useState([]); // State to hold the fetched questions

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      subject,
      question,
      options,
      correctOption,
    };

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      const data = await response.json();
      if (data.success) {
        alert("Question added successfully!");
        setSubject("");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectOption("");
        fetchQuestions(); // Reload questions after adding a new one
      } else {
        alert("Error adding question.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard - Add New Question</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subject">Subject:</label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Select Subject</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
          </select>
        </div>

        <div>
          <label htmlFor="question">Question:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="options">Options:</label>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="correctOption">Correct Option:</label>
          <select
            id="correctOption"
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
            required
          >
            <option value="">Select Correct Option</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Add Question</button>
      </form>

      <h2>All Questions</h2>
      <div>
        {questions.length > 0 ? (
          <ul>
            {questions.map((q) => (
              <li key={q.id}>
                <strong>{q.subject}</strong>: {q.question}
                <ul>
                  <li>1. {q.option1}</li>
                  <li>2. {q.option2}</li>
                  <li>3. {q.option3}</li>
                  <li>4. {q.option4}</li>
                </ul>
                <p>Correct Option: {q.correct_option}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
}
