import React, { useState } from "react";
import { BASE_URL } from "../config/config";
import "./Side.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function DetailsCard({ todayScore, thisWeekScores, previousWeeks, highScore }) {
  const [page, setPage] = useState(0);

  const sections = [
    {
      title: "Today's Score",
      content: <p className="ScoreValue">{todayScore}</p>,
    },
    {
      title: "This Week's Scores",
      content: (
        <ul className="ScoreList">
          {thisWeekScores.map((s, idx) => (
            <li key={idx}>
              <span>{s.date}</span> <span>{s.score}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Previous Weeks",
      content: (
        <ul className="ScoreList">
          {previousWeeks.map((w, idx) => (
            <li key={idx}>
              <span>{w.week_start} → {w.week_end}</span>
              <span>{w.score}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "High Score",
      content: <p className="ScoreValue">{highScore}</p>,
    },
  ];

  const nextPage = () => setPage((prev) => (prev + 1) % sections.length);
  const prevPage = () => setPage((prev) => (prev - 1 + sections.length) % sections.length);

  return (
    <div className="DetailsCard">
      <div className="DetailsHeader">
        <button className="ArrowButton" onClick={prevPage}>
          <FaArrowLeft />
        </button>
        <h2 className="DetailsTitle">{sections[page].title}</h2>
        <button className="ArrowButton" onClick={nextPage}>
          <FaArrowRight />
        </button>
      </div>
      <div className="DetailsSection slide-fade">{sections[page].content}</div>
    </div>
  );
}

export default DetailsCard;
