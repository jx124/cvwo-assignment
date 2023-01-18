import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavigationBar from './features/navbar/NavigationBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Post from './pages/Post';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="App container">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/posts' element={<Post />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
