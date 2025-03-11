import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const MoodLogger = () => {
  const [moodText, setMoodText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat");
      setChatHistory(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleMoodSubmit = async () => {
    if (!moodText.trim()) return;
    try {
      const response = await axios.post("http://localhost:5000/api/mood/add", { text: moodText });
      setMoodText("");
      fetchChatHistory();
    } catch (error) {
      console.error("Error submitting mood entry:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mood Logger</h1>
      <input
        type="text"
        value={moodText}
        onChange={(e) => setMoodText(e.target.value)}
        className="border p-2 w-full rounded"
        placeholder="How are you feeling today?"
      />
      <button
        onClick={handleMoodSubmit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
      <div className="mt-6 p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Chat History</h2>
        <ul>
          {chatHistory.map((entry, index) => (
            <li key={index} className="mb-2 p-2 border-b">
              <strong>You:</strong> {entry.text} <br />
              <strong>AI:</strong> {entry.aiResponse}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [moodData, setMoodData] = useState([]);
  const [moodDistribution, setMoodDistribution] = useState([]);
  const [insights, setInsights] = useState("");

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/mood");
      const data = response.data;

      setMoodData(data.map(entry => ({
        date: entry.date,
        moodScore: entry.moodScore,
      })));
      
      const moodCounts = {};
      data.forEach(entry => {
        moodCounts[entry.moodCategory] = (moodCounts[entry.moodCategory] || 0) + 1;
      });
      setMoodDistribution(Object.keys(moodCounts).map(key => ({ name: key, value: moodCounts[key] })));

      setInsights("Your average mood has been stable. Try incorporating mindfulness exercises!");
    } catch (error) {
      console.error("Error fetching mood data:", error);
    }
  };

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d84c4c"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mood Tracker Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Mood Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="moodScore" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Mood Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={moodDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6 p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">AI Insights</h2>
        <p>{insights}</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          <Link to="/" className="mr-4 text-blue-500">Log Mood</Link>
          <Link to="/dashboard" className="text-blue-500">Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MoodLogger />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
