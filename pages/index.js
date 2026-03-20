import { useEffect, useState } from "react";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store which questions have been revealed (clicked)
  const [revealedQuestions, setRevealedQuestions] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch("/api/question")
      .then((res) => res.json())
      .then((data) => {
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setError("No questions available. Please add questions from the dashboard.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch questions. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleQuestionClick = (index) => {
    // Mark this question as revealed
    setRevealedQuestions((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const handlePaginationNext = () => {
    if (currentQuestionIndex + 10 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 10);
    } else {
      alert("No more questions.");
    }
  };

  const handlePaginationPrev = () => {
    if (currentQuestionIndex - 10 >= 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 10);
    }
  };

  const currentQuestionsToDisplay = questions.slice(
    currentQuestionIndex,
    currentQuestionIndex + 10
  );

  return (
    <div className="container">
      <h1>MCQ Quiz</h1>

      {loading && <p>Loading questions...</p>}
      {error && <p>{error}</p>}

      <div className="question-container">
        {currentQuestionsToDisplay.map((question, index) => {
          const actualIndex = currentQuestionIndex + index;
          const isRevealed = revealedQuestions[actualIndex];

          return (
            <div
              key={index}
              className="question"
              onClick={() => handleQuestionClick(actualIndex)} // single click per question
            >
              <h2>{question.question}</h2>

              <div className="options">
                {question.options.map((option, optionIndex) => (
                  <span
                    key={optionIndex}
                    style={{
                      display: "inline-block",
                      margin: "5px",
                      padding: "10px 15px",
                      // border: "1px solid #e20808",
                      cursor: "pointer",
                      backgroundColor:
                        isRevealed && option === question.correctOption
                          ? "green" // correct highlighted
                          : "white",
                      color:
                        isRevealed && option === question.correctOption
                          ? "white"
                          : "black",
                      borderRadius: "5px",
                    }}
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button
          onClick={handlePaginationPrev}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        <button
          onClick={handlePaginationNext}
          disabled={currentQuestionIndex + 10 >= questions.length}
        >
          Next
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <a href="/dashboard">Go to Dashboard</a>
      </div>
    </div>
  );
}