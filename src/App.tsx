import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Registration from './components/Registration';
import Login from './components/Login';
import Upload from "./components/UploadDoc";
 


function App() {
  return (
    <div>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <Routes>
            <Route path='/reg' element={<Registration/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/upload' element={<Upload/>}></Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App;