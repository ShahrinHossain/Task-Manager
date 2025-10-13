import React, { useEffect, useState } from "react";
import "../../public/style.css";
import axios from "axios";
import DetailsCard from "./DetailsCard";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();

const monthName = monthNames[today.getMonth()];
const dayName = dayNames[today.getDay()];
const dayDate = today.getDate();

function Side() {
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/score", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScoreData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScore();
  }, []);

  return (
    <div>
      <div className="PictureCard">
        <p1>{dayDate}</p1>
        <p2>{monthName}</p2>
        <p3>{dayName}</p3>
      </div>

      {scoreData && (
        <DetailsCard
          todayScore={scoreData.today_score}
          thisWeekScores={scoreData.this_week_scores}
          previousWeeks={scoreData.previous_weeks}
          highScore={100} // later you can replace with actual value from API
        />
      )}
    </div>
  );
}

export default Side;
