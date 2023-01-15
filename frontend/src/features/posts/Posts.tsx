import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks'
import { AppDispatch } from '../../app/store';
import { fetchPostAsync, PostState, selectPosts, selectStatus, Statuses } from './postSlice';

// Iterates through all posts and renders Post.tsx components
function Posts() {
  const posts = useAppSelector(selectPosts);
  const status = useAppSelector(selectStatus);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPostAsync());
  }, [dispatch]);

  let contents;

  if (status !== Statuses.UpToDate) {
    contents = <div>{status}</div>
  } else {
    contents = <div className='card'>
      <div className='card-body'>
        <p>{status}</p>
        {posts && posts.length > 0 && posts.map((post: PostState) => {
          return <div key={post.id} style={{margin: "5em"}}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <div>
              <h3>Tags:</h3>{post.tags?.map(tag => <p>{tag}</p>)}
            </div>
            <h3>Rating: {post.rating}</h3>
            <h3>Created by: {post.user_id}</h3>
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