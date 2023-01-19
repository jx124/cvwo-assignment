import React from 'react'
import ButtonGroup from "./ButtonGroup";

function Post(props: any) { // TODO: fix any type
  const post = props.post;
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <div>
        <h3>Tags:</h3>{post.tags?.map((tag: string) => <p>{tag}</p>)}
      </div>
      <h3>Rating: {post.rating}</h3>
      <h3>Created by: {post.user_id}</h3>
      <ButtonGroup
        post_id={props.post.id}
        dispatch={props.dispatch}
      />
    </div>
  )
}

export default Post