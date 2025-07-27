import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Graph from './components/graph';
import ProductDetail from './components/ProductDetail';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import StatisticsPage from './components/stat';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            {/* <div className="col-md-3 col-lg-2 bg-dark text-white min-vh-100">
              <Sidebar />
            </div> */}
            
            {/* Main Content */}
            <div className="p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/graph" element={<Graph />} />
                <Route path="/:id" element={<ProductDetail />} />
                <Route path="/statistics" element={<StatisticsPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;