import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks';
import { AppDispatch } from '../app/store';
import CheckAuthCookie from '../features/auth/CheckAuthCookie';
import CommentForm from '../features/comments/CommentForm';
import Comments from '../features/comments/Comments';
import Post from '../features/posts/Post';
import { fetchSpecificPostsAsync, selectPosts, selectPostStatus } from '../features/posts/postSlice';

function Thread() {
    CheckAuthCookie();
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
        <div className='App container'>
            <div style={{margin: "5em"}}>
                <Post dispatch={dispatch} post={posts[0]} clickable={false}/>
                <CommentForm dispatch={dispatch} />
                <Comments dispatch={dispatch} query={searchParams.toString()} clickable={false} />
            </div>
        </div>
    )
}

export default Thread