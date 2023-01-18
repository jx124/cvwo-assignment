import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Comments from '../features/comments/Comments';
import Posts from '../features/posts/Posts';

function Post() {
    const [searchParams, setSearchParams] = useSearchParams();
    const postId = searchParams.get("post_id");
    const userId = searchParams.get("user_id");

    return (
        <div className='App container'>
            <h3>Post ID: {postId}</h3>
            <h3>User ID: {userId}</h3>
            <Posts />
            <Comments />
        </div>
    )
}

export default Post