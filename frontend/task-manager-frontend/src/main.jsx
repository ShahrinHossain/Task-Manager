// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// // import 'bootstrap/dist/css/bootstrap.min.css';

// createRoot(document.getElementById('root')).render(
//     <StrictMode>
//         <App/>
//     </StrictMode>    
// );

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>   {/* This is required */}
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/app" element={<App />} />
    </Routes>
  </BrowserRouter>
);


