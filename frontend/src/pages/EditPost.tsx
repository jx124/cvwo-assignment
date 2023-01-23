import React from 'react'
import CheckAuthCookie from '../features/auth/CheckAuthCookie';
import EditPostForm from '../features/posts/EditPostForm'

function EditPost() {
    CheckAuthCookie();
    return (
    <div className='App container'>
        <EditPostForm />
    </div>
  )
}

export default EditPost