import CheckAuthCookie from '../features/auth/CheckAuthCookie';
import LoginForm from '../features/auth/LoginForm'

function Login() {
    CheckAuthCookie();
    return (
    <div className='App container'>
        <LoginForm />
    </div>
  )
}

export default Login