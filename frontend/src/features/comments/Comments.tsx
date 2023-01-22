import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks'
import { AppDispatch } from '../../app/store';
import { CommentState, CommentStatuses, fetchCommentsAsync, selectComments, selectCommentStatus } from './commentSlice';
import Comment from './Comment';

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
            <div className='card' style={{ margin: "5em" }}>
                <div className='card-body'>
                    {comments && comments.length > 0 && comments.map((comment: CommentState) => {
                        return <Comment data={comment} />
                    })}
                </div>
            </div>
    }

    return (
        <div>
            <div className='card' style={{ margin: "5em" }}>
                <div className='card-body'>
                    {/* TODO: add comment form */}
                    <textarea className='form-control text-start'></textarea>
                </div>
            </div>
            {contents}
        </div>
    )
}

export default Comments