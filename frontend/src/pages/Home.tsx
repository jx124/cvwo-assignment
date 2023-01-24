import CheckAuthCookie from '../features/auth/CheckAuthCookie';
import Posts from '../features/posts/Posts'
import SearchBar from '../features/searchbar/SearchBar';

function Home() {
    CheckAuthCookie();
    return (
        <div className='App container'>
            <SearchBar />
            <Posts />
        </div>
    )
}

export default Home