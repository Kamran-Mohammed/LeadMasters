import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  return (
    <div className="dashboard">
      <h1>Welcome back, {user?.name || "User"} 👋</h1>

      <div className="dashboard-actions">
        <Link to="/quiz" className="btn">
          Start Test
        </Link>
        {/* <Link to="/results" className="btn">
          View Results
        </Link> */}
      </div>
    </div>
  );
};

export default Dashboard;
