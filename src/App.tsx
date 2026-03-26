import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Registration from './components/Registration';
import Login from './components/Login';
import Upload from "./components/UploadDoc";
import RegSuccess from './components/RegSuccess';
import RegFailure from './components/RegFailure';
import LoginSuccess from './components/Loginsuccess';
import LoginFailure from './components/LoginFailure';
//import MyLogin from './components/MyLogin';
import DemoGreeting from './components/DemoLogin';
import HomePage from './components/HomePage';


import RecentPage from './components/RecentPage';



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
            <Route path="/regsuccess" element={<RegSuccess />} />
            <Route path='/regfail' element={<RegFailure/>}></Route>
            <Route path='/loginsuccess' element={<LoginSuccess/>}></Route>
            <Route path='/loginfail' element={<LoginFailure/>}></Route>


            <Route path='/homepage' element={<HomePage/>}></Route>
           <Route path='/demologin' element={<DemoGreeting/>}></Route> 
            <Route path='/recent' element={<RecentPage/>}></Route>
           

       
            
          

            

          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App;