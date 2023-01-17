import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../features/auth/LoginForm'

function Login() {
  const hyperlink = <Link to="/signup">sign up</Link>;

  return (
    <div className='App container'>
        <LoginForm />
        <p>Click here to {hyperlink}.</p>
    </div>
  )
}

export default Login