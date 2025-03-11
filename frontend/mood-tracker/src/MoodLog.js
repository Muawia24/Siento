import React, { useState, useEffect } from "react";
import axios from "axios";

function MoodLog() {
  const [mood, setMood] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/mood/history").then((response) => {
      setChatHistory(response.data);
    });
  }, []);

  const submitMood = async () => {
    if (!mood.trim()) return;

    const response = await axios.post("http://localhost:5000/api/mood/add", { text: mood });
    setChatHistory([...chatHistory, { text: mood, aiResponse: response.data.aiResponse }]);
    setMood(""); // Clear input
  };

  return (
    <div>
      <h2>Mood Log</h2>
      <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="How are you feeling?" />
      <button onClick={submitMood}>Submit</button>

      <h3>Chat History</h3>
      <ul>
        {chatHistory.map((entry, index) => (
          <li key={index}>
            <strong>You:</strong> {entry.text} <br />
            <strong>AI:</strong> {entry.aiResponse}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodLog;
