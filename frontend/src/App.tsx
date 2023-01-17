import React from 'react';
import Posts from './features/posts/Posts';
import './App.css';
import LoginForm from './features/login/LoginForm';

function App() {
  return (
    <div className="App container">
      <LoginForm />
      <Posts />
    </div>
  );
}

export default App;
