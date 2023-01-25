import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks'
import { AppDispatch } from '../../app/store';
import Post from './Post';
import { fetchPostsAsync, PostState, selectPosts, selectPostStatus, PostStatuses, selectRankedPosts } from './postSlice';

/**
 * Main posts component. Fetches posts and sends each posts to be rendered in the Post component.
 */
function Posts() {
    const posts = useAppSelector(selectPosts);
    const rankedPosts = useAppSelector(selectRankedPosts);
    const status = useAppSelector(selectPostStatus);
    const dispatch = useDispatch<AppDispatch>();

    // fetch posts once at start which updates "posts" state, triggering SearchBar's useEffect hook
    useEffect(() => {
        dispatch(fetchPostsAsync());
    }, [dispatch]);

    let contents = null;

    const createPostLink = <Link to="/posts/new">Create a new post.</Link>

    if (status !== PostStatuses.UpToDate) {
        contents = <div>{status}</div>
    } else {
        contents = <div key="posts" className='card mt-0' style={{ margin: "5em" }}>
            <div className='card-body pb-0'>
                {posts.length === 0 && 
                    <div className='fs-4 mb-3'>
                        There are no posts yet. {createPostLink}
                    </div>
                }
                {posts.length !== 0 && rankedPosts.length === 0 && 
                    <div className='fs-4 mb-3'>
                        No posts matching search.
                    </div>
                }
                {rankedPosts && rankedPosts.length > 0 && rankedPosts.map((post: PostState) => {
                    return (
                        <Post post={post} clickable={true}/>
                    )
                })}
            </div>
        </div>
    }

    return (
        <div>
            {contents}
        </div>
    )
}

export default Posts