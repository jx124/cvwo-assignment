import React from 'react'
import CheckAuthCookie from '../features/auth/CheckAuthCookie';
import PostForm from '../features/posts/PostForm'

function CreatePost() {
    CheckAuthCookie();
    return (
    <div className='App container'>
        <PostForm />
    </div>
  )
}

export default CreatePost