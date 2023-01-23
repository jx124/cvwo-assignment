import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../app/hooks';
import { AppDispatch } from '../app/store';
import { selectAuthData } from '../features/auth/authSlice';
import CheckAuthCookie from '../features/auth/CheckAuthCookie';
import Comment from '../features/comments/Comment';
import Comments from '../features/comments/Comments';
import { CommentState, selectComments } from '../features/comments/commentSlice';
import Post from '../features/posts/Post';
import { fetchSpecificPostsAsync, PostState, selectPosts } from '../features/posts/postSlice';

function Profile() {
    CheckAuthCookie();
    const dispatch = useDispatch<AppDispatch>();
    const authData = useAppSelector(selectAuthData);
    const posts = useAppSelector(selectPosts);

    const createdDate = new Date(authData.user?.created_at ? authData.user.created_at : "");
    const queryString = "user_id=" + authData.user?.id;

    useEffect(() => {
        console.log("query string: ", queryString);
        dispatch(fetchSpecificPostsAsync(queryString));
    }, []);

    return (
        <div className='App container'>
            <div>
                <div className='card' style={{ margin: "5em" }}>
                    <div className='card-body' style={{ margin: "3em" }}>
                        <h1 className='text-start'>
                            Profile
                        </h1>
                        <div className="card text-start px-3 pt-2">
                            <h5>Username</h5>
                            <p>{authData.user?.username}</p>
                            <h5>Account created</h5>
                            <p>{createdDate.toString()}</p>
                        </div>
                    </div>
                    <div className='card-body mt-0' style={{ margin: "3em" }}>
                        <h1 className='text-start'>
                            Posts
                        </h1>
                        <div className='card px-3 py-2'>
                            {posts && posts.length > 0 && posts.map((post: PostState) => {
                                return (
                                    <Post post={post} clickable={true} />
                                )
                            })}
                        </div>
                    </div>
                    <div className='card-body mt-0' style={{ margin: "3em" }}>
                        <h1 className='text-start'>
                            Comments
                        </h1>
                        <Comments query={queryString} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile