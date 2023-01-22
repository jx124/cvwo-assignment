import React from 'react'
import { humanReadableDuration } from '../utils/humanReadableDuration';
import { CommentProp } from './commentSlice'

function Comment({ data }: CommentProp) {
    const comment = data;
    const commentCreatedTime = new Date(comment.created_at ? comment.created_at : 0).getTime();
    const commentUpdatedTime = new Date(comment.updated_at ? comment.updated_at : 0).getTime();
    const currentTime = new Date().getTime();
    const createdOffset = currentTime - commentCreatedTime;
    const updatedOffset = currentTime - commentUpdatedTime;

    return (
        <div className="card text-start px-3 py-2 m-4" key={comment.id}>
            <div className='row mt-1'>
                <div className='col-auto pe-1'>
                    <p className='fw-bold'>{comment.user_id}</p>
                </div>
                <div className='col-auto ps-1 pe-0'>
                    <p className='text-secondary'>{" · \u00A0" + humanReadableDuration(createdOffset) + " ago"}</p>
                </div>
                {createdOffset !== updatedOffset &&
                    <div className='col-auto ps-2'>
                        <p className='text-secondary'>
                            <p className='text-secondary fst-italic'>
                                {" · \u00A0edited " + humanReadableDuration(updatedOffset) + " ago"}
                            </p>
                        </p>
                    </div>}
                <div className='col-auto ms-auto'>
                    <button className='btn btn-outline-secondary btn-sm dropdown-toggle' data-bs-toggle="dropdown">...</button>
                    <ul className='dropdown-menu dropdown-menu-end'>
                        <li className='dropdown-item'
                        // onClick={() => linkTo(`/posts/edit/?post_id=${post.id}`)}
                        >Edit</li>
                        <li className='dropdown-item text-danger'
                        // onClick={handleDeleteClick}
                        >Delete</li>
                    </ul>
                </div>
            </div>
            <div className='mb-1'>
                {comment.body}
            </div>
            <div className='row'>
                <div className='col-auto pt-1'>
                    <h5>
                        ᐃ {comment.rating} ᐁ
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default Comment