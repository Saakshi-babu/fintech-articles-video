import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Learn from './pages/Learn';
import StepFlow from './pages/StepFlow';
import Saved from './pages/Saved';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/workflow/:id" element={<StepFlow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
