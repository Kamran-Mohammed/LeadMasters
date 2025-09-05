import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/Quiz.css";
import { useAuth } from "../context/AuthContext";

const Quiz = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 30 min
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quesLoading, setQuesLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setQuesLoading(true);
      try {
        const { data } = await api.get("/questions");
        setQuestions(data.data || []); // use data.data based on API response
      } catch (err) {
        console.error("Failed to load questions:", err);
      }
      setQuesLoading(false);
    };
    fetchQuestions();
  }, []);

  const handleSubmit = useCallback(() => {
    const confirmed = window.confirm(
      "Are you sure you want to submit the quiz?"
    );
    if (!confirmed) return;

    let sc = 0;
    questions.forEach((q) => {
      if (answers[q._id] && answers[q._id] === q.answer) {
        sc++;
      }
    });
    setScore(sc);
    setSubmitted(true);
  }, [answers, questions]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, handleSubmit]);

  const handleAnswer = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (submitted) {
    return (
      <div className="quiz-container submitted">
        <h2 className="submitted-title">Exam Submitted ✅</h2>

        <div className="score-box">
          <span className="score-label">Your Score:</span>
          <span className="score-value">
            {score} / {questions.length}
          </span>
        </div>

        <div className="results">
          {questions.map((q, i) => {
            const userAns = answers[q._id];
            const correct = q.answer;
            return (
              <div key={q._id} className="result-item">
                <h3 className="result-question">
                  Q{i + 1}. {q.question}
                </h3>
                <p>
                  Your Answer:{" "}
                  <span
                    className={
                      userAns
                        ? userAns === correct
                          ? "correct"
                          : "wrong"
                        : "unanswered"
                    }
                  >
                    {userAns || "Not Answered"}
                  </span>
                </p>
                <p className="correct-answer">Correct Answer: {correct}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (quesLoading) return <p>Loading questions...</p>;
  if (!questions || questions.length === 0) return <p>No questions found.</p>;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Exam</h1>
        <div className="timer">⏳ {formatTime(timeLeft)}</div>
      </div>

      <div className="quiz-body">
        <div className="question-panel">
          {questions[current] && (
            <>
              <h2>
                Q{current + 1}. {questions[current].question}
              </h2>
              <ul>
                {questions[current].options.map((opt, idx) => (
                  <li key={idx}>
                    <label>
                      <input
                        type="radio"
                        name={`q-${questions[current]._id}`}
                        value={opt}
                        checked={answers[questions[current]._id] === opt}
                        onChange={() =>
                          handleAnswer(questions[current]._id, opt)
                        }
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            type="button"
            className="clear-btn"
            onClick={() => handleAnswer(questions[current]._id, null)}
            disabled={!answers[questions[current]._id]}
          >
            Clear Answer
          </button>

          <div className="nav-buttons">
            <button
              onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
              disabled={current === 0}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrent((c) => Math.min(c + 1, questions.length - 1))
              }
              disabled={current === questions.length - 1}
            >
              Next
            </button>
          </div>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Exam
          </button>
        </div>

        <div className="question-nav">
          {questions.map((q, i) => (
            <button
              key={q._id}
              className={`q-btn 
                ${i === current ? "current" : ""} 
                ${answers[q._id] ? "answered" : "not-answered"}`}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
