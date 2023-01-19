import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavigationBar from './features/navbar/NavigationBar';
import PostForm from './features/posts/PostForm';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Thread from './pages/Thread';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/posts/' element={<Thread />} />
          <Route path='/posts/new' element={<PostForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
