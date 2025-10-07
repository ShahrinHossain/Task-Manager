import React from 'react';
import "../../public/style.css";

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const today = new Date();
const monthNumber = today.getMonth(); 
const dayNumber = today.getDay();
const monthName = monthNames[monthNumber];
const dayName = dayNames[dayNumber];
const dayDate = today.getDate();

function Side(){
    return(
    <div>
        <div className= 'PictureCard'>
           <h1>{dayDate}</h1>
           <h2>{monthName}</h2>
           <h6>{dayName}</h6>
        </div>
        <div className= 'DetailsCard'>
            <p>fhdifrfi</p>
        </div>
    </div>
    )
}


export default Side;