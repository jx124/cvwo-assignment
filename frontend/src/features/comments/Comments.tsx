import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks'
import { AppDispatch } from '../../app/store';
import { CommentState, CommentStatuses, fetchCommentsAsync, selectComments, selectCommentStatus } from './commentSlice';

function Comments(props: any) { // fix any type
  const query = props.query; // temporary placeholder. TODO: get query from route
  const comments = useAppSelector(selectComments);
  const status = useAppSelector(selectCommentStatus);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCommentsAsync(query));
  }, [dispatch])
  
  let contents = null;

  if (status !== CommentStatuses.UpToDate) {
    contents = <div>{status}</div>
  } else {
    contents = 
    <div className='card' style={{margin: "5em"}}>
      <div className='card-body'>
        <p>{status}</p>
        {comments && comments.length > 0 && comments.map((comment: CommentState) => {
          return <div key={comment.id} style={{margin: "5em"}}>
            <p>{comment.body}</p>
            <h3>Rating: {comment.rating}</h3>
            <h3>Created by: {comment.user_id}</h3>
            <h3>Under post: {comment.post_id}</h3>
            <p>Created: {comment.created_at}</p>
          </div>
        })}
      </div>
    </div>
  }

  return (
    <div>
      <h1>Comments</h1>
      {contents}
    </div>
  )
}

export default Comments