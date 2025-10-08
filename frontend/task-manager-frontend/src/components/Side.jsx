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
           <p1>{dayDate}</p1>
           <p2>{monthName}</p2>
           <p3>{dayName}</p3>
        </div>
        <div className= 'DetailsCard'>
            <p>fhdifrfi</p>
        </div>
    </div>
    )
}


export default Side;