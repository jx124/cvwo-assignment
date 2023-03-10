import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks'
import { AppDispatch } from '../../app/store';
import { CommentState, CommentStatuses, fetchCommentsAsync, selectComments, selectCommentStatus } from './commentSlice';
import Comment from './Comment';

/**
 * Main comments component. Fetches comments and sends each comment to be rendered in the Comment component.
 */
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
            <div className='card mb-3'>
                <div className='card-body pb-0'>
                    {comments.length === 0 &&
                        <div className='fs-5 mb-3 text-secondary'>
                            There are no comments yet.
                        </div>
                    }
                    {comments && comments.length > 0 && comments.map((comment: CommentState) => {
                        return <Comment data={comment} clickable={props.clickable} />
                    })}
                </div>
            </div>
    }

    return (
        <div>
            {contents}
        </div>
    )
}

export default Comments