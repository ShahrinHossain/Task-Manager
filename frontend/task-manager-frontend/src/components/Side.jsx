import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/config";
import "./Side.css";
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
  const [userInfo, setUserInfo] = useState({ bestscore: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const scoreRes = await axios.get(`${BASE_URL}/score`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScoreData(scoreRes.data);

        const userRes = await axios.get(`${BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo({ bestscore: userRes.data.bestscore });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="PictureCard">
        <div className="p1">{dayDate}</div>
        <div className="p2">{monthName}</div>
        <div className="p3">{dayName}</div>
      </div>

      {scoreData && (
        <DetailsCard
          todayScore={scoreData.today_score}
          thisWeekScores={scoreData.this_week_scores}
          previousWeeks={scoreData.previous_weeks}
          highScore={userInfo.bestscore} 
        />
      )}
    </div>
  );
}

export default Side;

