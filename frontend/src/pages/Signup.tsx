import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../features/auth/LoginForm'

function Signup() {
  const hyperlink = <Link to="/login">log in</Link>;

  return (
    <div className='App container'>
        <LoginForm />
        <p>Click here to {hyperlink}.</p>
    </div>
  )
}

export default Signup