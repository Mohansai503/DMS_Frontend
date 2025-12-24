import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Registration from './components/Registration';
import Login from './components/Login';
import Upload from "./components/UploadDoc";
import RegSuccess from './components/RegSuccess';
import SuccessPage from './components/SuccessPage';
import RegFailure from './components/RegFailure';
import LoginSuccess from './components/Loginsuccess';
import LoginFailure from './components/LoginFailure';
 


function App() {
  return (
    <div>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <Routes>
            <Route path='/reg' element={<Registration/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/Upload' element={<Upload/>}></Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/regsuccess" element={<RegSuccess />} />
            <Route path='/s' element={<SuccessPage/>}></Route>
            <Route path='/regfail' element={<RegFailure/>}></Route>
            <Route path='/loginsuccess' element={<LoginSuccess/>}></Route>
            <Route path='/loginfail' element={<LoginFailure/>}></Route>
            
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App;