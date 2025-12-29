import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Registration from './components/Registration';
import Login from './components/Login';
import TrashPage from './components/TrashPage';
import SearchBar from './components/SearchBar';


function App() {
  return (
    <div>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <Routes>
            <Route path='/reg' element={<Registration/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/trash' element={<TrashPage/>}></Route>
            <Route path='/search' element={<SearchBar value={''} onChange={function (event: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error('Function not implemented.');
            } }/>}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App;
