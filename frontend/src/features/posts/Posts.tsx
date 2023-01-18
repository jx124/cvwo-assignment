import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks'
import { AppDispatch } from '../../app/store';
import Post from './Post';
import { fetchPostAsync, PostState, selectPosts, selectPostStatus, PostStatuses } from './postSlice';

// Iterates through all posts and renders Post.tsx components
function Posts() {
  const posts = useAppSelector(selectPosts);
  const status = useAppSelector(selectPostStatus);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPostAsync());
  }, [dispatch]);

  let contents = null;

  if (status !== PostStatuses.UpToDate) {
    contents = <div>{status}</div>
  } else {
    contents = <div className='card' style={{margin: "5em"}}>
      <div className='card-body'>
        {posts && posts.length > 0 && posts.map((post: PostState) => {
          return <div key={post.id} style={{margin: "5em"}}>
            <Post 
              dispatch={dispatch}
              post={post}
            />
          </div>
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