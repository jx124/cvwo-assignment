import { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { AppDispatch } from '../../app/store';
import { selectAuthData } from '../auth/authSlice';
import { humanReadableDuration } from '../utils/humanReadableDuration';
import { CommentFormInput, CommentProp, DeleteCommentRequest, destroyCommentAsync, fetchCommentsAsync, updateCommentAsync, UpdateCommentRequest } from './commentSlice'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';

// move to commentSlice?
const commentSchema = yup.object({
    body: yup
        .string()
        .min(5, "Comment must contain at least 5 characters")
        .max(1000, "Comment cannot exceed 500 characters")
        .strict()
        .required("Comment cannot be empty")
})

function Comment({ data, clickable }: CommentProp) {
    const comment = data;
    const commentCreatedTime = new Date(comment.created_at ? comment.created_at : 0).getTime();
    const commentUpdatedTime = new Date(comment.updated_at ? comment.updated_at : 0).getTime();
    const currentTime = new Date().getTime();
    const createdOffset = currentTime - commentCreatedTime;
    const updatedOffset = currentTime - commentUpdatedTime;

    const [isEditing, setIsEditing] = useState(false);
    const [body, setBody] = useState(comment.body);
    const [shadow, setShadow] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const { register, handleSubmit, formState: { errors } } = useForm<CommentFormInput>({
        resolver: yupResolver(commentSchema),
    });

    const editableBody =
        <textarea
            className='form-control text-start'
            style={{ minHeight: "100px" }}
            value={body}
            {...register("body")}
            onChange={(e) => setBody(e.target.value)}>
        </textarea>

    const authData = useAppSelector(selectAuthData);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // export interface UpdateCommentRequest {
    //     comment_id: number,
    //     data: {
    //         body: string;
    //     },
    //     token: string;
    // }

    async function handleEditClick() {

        const request = {
            comment_id: comment.id,
            data: {
                body: body,
            },
            token: authData.token
        } as UpdateCommentRequest

        await dispatch(updateCommentAsync(request))
            .then((response) => {
                setIsEditing(false);
                dispatch(fetchCommentsAsync(searchParams.toString()));
                return response;
            });
    }

    async function handleDeleteClick(e: any) {
        e.preventDefault();

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
                return response;
            });
    }

    return (<>
        <div className={shadow + "card text-start px-3 py-2 mb-3"}
            key={comment.id}
            style={{ transition: "0.1s" }}
            onMouseEnter={() => { clickable && setShadow("shadow ") }}
            onMouseLeave={() => { clickable && setShadow("") }}
            onClick={() => { clickable && navigate(`/posts/?post_id=${comment.post_id}`) }}>

            <div className='row mt-1' style={{ height: "31px" }}>
                <div className='col-auto pe-1'>
                    <p className='fw-bold'>{comment.username}</p>
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
                {!clickable && comment.user_id === authData.user?.id &&
                    <div className='col-auto ms-auto'>
                        <button className='btn btn-outline-secondary btn-sm dropdown-toggle' data-bs-toggle="dropdown">...</button>
                        <ul className='dropdown-menu dropdown-menu-end'>
                            <li className='dropdown-item'
                                key="editDropdown"
                                onClick={() => setIsEditing(true)}
                            >Edit</li>
                            <li className='dropdown-item text-danger'
                                key="deleteDropdown"
                                onClick={() => setShowModal(true)}
                            >Delete</li>
                        </ul>
                    </div>
                }
            </div>
            <form onSubmit={handleSubmit(handleEditClick)}>
                <div className='my-1'>
                    { isEditing 
                        ? editableBody 
                        : comment.body?.split('\n')
                            .map((str: string) => <p className='mb-0'>{str ? str : "\u00A0"}</p>)}
                </div>
                <div className='row'>
                    <div className='col-auto pt-1'>
                        <h5>
                            ᐃ {comment.rating} ᐁ
                        </h5>
                    </div>
                    <div className='col-auto form-text text-danger pt-1'>
                        {errors.body?.message}
                    </div>
                    {isEditing &&
                        <div className='col-auto ms-auto'>
                            <input className='btn btn-secondary btn-sm form-control'
                                type="submit"
                                disabled={!isEditing}
                                value="Edit Comment" />
                        </div>
                    }
                </div>
            </form>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Delete Comment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                This action is irreversible. Are you sure you want to continue?
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-secondary' onClick={() => setShowModal(false)}>
                    Close
                </button>
                <button className='btn btn-danger' onClick={handleDeleteClick}>
                    Delete
                </button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default Comment