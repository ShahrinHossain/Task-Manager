import React from "react"; 
import { useLocation, useNavigate } from "react-router-dom"; 
import "./ErrorPage.css"; 

function ErrorPage() { 
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const message = location.state?.message || "Oops! Something went wrong."; 
    const code = location.state?.code || "Error";

    return ( 
        <div>
            <div className="AppName">DoneZone Apologizes</div> 
            <div className="error-container">
                <h1 className="error-code">Error Code: {code}</h1> 
                <p className="error-message">{message}</p> 
                <button className="home-link" 
                    onClick={() => navigate(-1)} 
                >
                    Go Back
                </button> 
            </div> 
        </div>
    ); 
} 

export default ErrorPage;
