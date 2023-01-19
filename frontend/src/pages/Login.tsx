import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../features/auth/LoginForm'

function Login() {
  return (
    <div className='App container'>
        <LoginForm />
    </div>
  )
}

export default Login