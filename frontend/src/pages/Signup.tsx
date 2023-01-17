import React from 'react'
import { Link } from 'react-router-dom'
import SignupForm from '../features/auth/SignupForm';

function Signup() {
  const hyperlink = <Link to="/login">log in</Link>;

  return (
    <div className='App container'>
        <SignupForm />
        <p>Click here to {hyperlink}.</p>
    </div>
  )
}

export default Signup