import CheckAuthCookie from '../features/auth/CheckAuthCookie';
import SignupForm from '../features/auth/SignupForm';

function Signup() {
    CheckAuthCookie();
    return (
    <div className='App container'>
        <SignupForm />
    </div>
  )
}

export default Signup