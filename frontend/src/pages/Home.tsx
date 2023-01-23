import CheckAuthCookie from '../features/auth/CheckAuthCookie';
import Posts from '../features/posts/Posts'

function Home() {
    CheckAuthCookie();
    return (
        <div className='App container'>
            <Posts />
        </div>
    )
}

export default Home