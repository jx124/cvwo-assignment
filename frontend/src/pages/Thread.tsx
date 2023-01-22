import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks';
import { AppDispatch } from '../app/store';
import Comments from '../features/comments/Comments';
import Post from '../features/posts/Post';
import { fetchSpecificPostsAsync, selectPosts, selectPostStatus } from '../features/posts/postSlice';

function Thread() {
    const [searchParams, setSearchParams] = useSearchParams();
    const postId = searchParams.get("post_id");
    const userId = searchParams.get("user_id");

    const posts = useAppSelector(selectPosts);
    const status = useAppSelector(selectPostStatus);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchSpecificPostsAsync(searchParams.toString()));
      }, [dispatch]);

    return (
        <div className='App container' style={{padding: "60px", margin: "auto"}}>
            <Post dispatch={dispatch} post={posts[0]} clickable={false}/>
            <Comments query={searchParams.toString()}/>
        </div>
    )
}

export default Thread