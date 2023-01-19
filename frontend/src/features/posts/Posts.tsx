import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks'
import { AppDispatch } from '../../app/store';
import Post from './Post';
import { fetchPostsAsync, PostState, selectPosts, selectPostStatus, PostStatuses } from './postSlice';

// Iterates through all posts and renders Post.tsx components
function Posts() {
    const posts = useAppSelector(selectPosts);
    const status = useAppSelector(selectPostStatus);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchPostsAsync());
    }, [dispatch]);

    let contents = null;

    if (status !== PostStatuses.UpToDate) {
        contents = <div>{status}</div>
    } else {
        contents = <div className='card' style={{ margin: "5em" }}>
            <div className='card-body'>
                {posts && posts.length > 0 && posts.map((post: PostState) => {
                    return (
                        <Post dispatch={dispatch} post={post} />
                    )
                })}
            </div>
        </div>
    }

    return (
        <div>
            <h1>Posts</h1>
            {contents}
        </div>
    )
}

export default Posts