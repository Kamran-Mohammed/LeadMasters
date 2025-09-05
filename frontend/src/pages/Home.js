import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to LeadMasters Quiz</h1>
      <p className="subtitle">
        Test your coding knowledge with fun and interactive quizzes.
      </p>

      <div className="features">
        <div className="feature-card">
          <h3>💻 Coding Questions</h3>
          <p>
            Practice multiple-choice coding questions across different topics.
          </p>
        </div>
        <div className="feature-card">
          <h3>⏱ Timed Quiz</h3>
          <p>Challenge yourself with a countdown timer for each quiz.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Results</h3>
          <p>Get instant results and see which questions you answered right.</p>
        </div>
      </div>

      <button className="start-btn" onClick={() => navigate("/quiz")}>
        🚀 Start Quiz
      </button>
    </div>
  );
};

export default Home;
