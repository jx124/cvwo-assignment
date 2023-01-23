import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { AppDispatch } from '../../app/store';
import { selectAuthData, selectAuthStatus } from '../auth/authSlice';
import { humanReadableDuration } from '../utils/humanReadableDuration';
import { CommentProp, DeleteCommentRequest, destroyCommentAsync, updateCommentAsync, UpdateCommentRequest } from './commentSlice'

function Comment({ data }: CommentProp) {
    const comment = data;
    const commentCreatedTime = new Date(comment.created_at ? comment.created_at : 0).getTime();
    const commentUpdatedTime = new Date(comment.updated_at ? comment.updated_at : 0).getTime();
    const currentTime = new Date().getTime();
    const createdOffset = currentTime - commentCreatedTime;
    const updatedOffset = currentTime - commentUpdatedTime;

    const [isEditing, setIsEditing] = useState(false);
    const [body, setBody] = useState(comment.body);

    const editableBody = <textarea
        className='form-control text-start'
        style={{ minHeight: "100px" }}
        onChange={(e) => setBody(e.target.value)}>
        {body}
    </textarea>

    const authData = useAppSelector(selectAuthData);
    const authStatus = useAppSelector(selectAuthStatus);
    const dispatch = useDispatch<AppDispatch>();

    // export interface UpdateCommentRequest {
    //     comment_id: number,
    //     data: {
    //         body: string;
    //     },
    //     token: string;
    // }

    // use a form for this?
    async function handleEditClick(e: any) {
        e.preventDefault();
        console.log(body);

        const request = {
            comment_id: comment.id,
            data: {
                body: body,
            },
            token: authData.token
        } as UpdateCommentRequest

        await dispatch(updateCommentAsync(request))
            .then((response) => {
                console.log("update comment response: ", response);
                setIsEditing(false);
                return response;
            });
    }

    async function handleDeleteClick(e: any) {
        e.preventDefault();
        console.log(body);

        // export interface DeleteCommentRequest {
        //     comment_id: number,
        //     token: string;
        // }

        const request = {
            comment_id: comment.id,
            token: authData.token
        } as DeleteCommentRequest

        await dispatch(destroyCommentAsync(request))
            .then((response) => {
                console.log("destroy comment response: ", response);
                return response;
            });
    }

    return (
        <div className="card text-start px-3 py-2 mb-3" key={comment.id}>
            <div className='row mt-1' style={{ height: "31px" }}>
                <div className='col-auto pe-1'>
                    <p className='fw-bold'>{comment.user_id}</p>
                </div>
                <div className='col-auto ps-1 pe-0'>
                    <p className='text-secondary'>{" · \u00A0" + humanReadableDuration(createdOffset) + " ago"}</p>
                </div>
                {createdOffset !== updatedOffset &&
                    <div className='col-auto ps-2'>
                        <p className='text-secondary fst-italic'>
                            {" · \u00A0edited " + humanReadableDuration(updatedOffset) + " ago"}
                        </p>
                    </div>}
                {comment.user_id === authData.user?.id &&
                    <div className='col-auto ms-auto'>
                        <button className='btn btn-outline-secondary btn-sm dropdown-toggle' data-bs-toggle="dropdown">...</button>
                        <ul className='dropdown-menu dropdown-menu-end'>
                            <li className='dropdown-item'
                                onClick={() => setIsEditing(true)}
                            >Edit</li>
                            <li className='dropdown-item text-danger'
                                onClick={handleDeleteClick}
                            >Delete</li>
                        </ul>
                    </div>
                }
            </div>
            <div className='my-1'>
                {isEditing ? editableBody : comment.body}
            </div>
            <div className='row'>
                <div className='col-auto pt-1'>
                    <h5>
                        ᐃ {comment.rating} ᐁ
                    </h5>
                </div>
                {isEditing &&
                    <div className='col-auto ms-auto'>
                        <button className='btn btn-secondary btn-sm form-control'
                            disabled={!isEditing}
                            onClick={handleEditClick}>Edit Comment</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Comment