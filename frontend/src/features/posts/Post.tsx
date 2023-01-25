import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { AppDispatch } from '../../app/store';
import { selectAuthData } from '../auth/authSlice';
import { selectComments } from '../comments/commentSlice';
import { humanReadableDuration } from '../utils/humanReadableDuration';
import { destroyPostAsync } from './postSlice';
import Modal from 'react-bootstrap/Modal';

/**
 * Post component. Displays all relevant information of a post in a card.
 */
function Post(props: any) { // TODO: fix any type
    const post = props.post;
    const navigate = useNavigate();

    if (!post) {
        // check if post is undefined (e.g. after deletion), redirect to home page if so
        navigate("/")
    }

    /**
     *  "clickable" means post can be clicked and linked to, e.g. from main or profile pages.
     *  This means the drop shadow animations will be visible and the dropdown menu to edit or
     *  delete post will not be visible.
     */
    const clickable = props.clickable;
    const [shadow, setShadow] = useState("");
    const [showModal, setShowModal] = useState(false);

    const postCreatedTime = new Date(post.created_at ? post.created_at : 0).getTime();
    const postUpdatedTime = new Date(post.updated_at ? post.updated_at : 0).getTime();
    const currentTime = new Date().getTime();
    const createdOffset = currentTime - postCreatedTime;
    const updatedOffset = currentTime - postUpdatedTime;

    const dispatch = useDispatch<AppDispatch>();
    const authData = useAppSelector(selectAuthData);
    const comments = useAppSelector(selectComments);

    const [commentCount, setCommentCount] = useState(0);

    // fetch comments for current post on change
    useEffect(() => {
        const commentCount = comments.filter((comment) => comment.post_id === post.id).length;
        setCommentCount(commentCount);
    }, [comments, post])

    const handleDeleteClick = async () => {
        const payload = {
            post: {
                post_id: post.id,
            },
            token: authData.token ? authData.token : "",
        }

        await dispatch(destroyPostAsync(payload))
            .then((response: any) => {
                if (!("error" in response.payload)) {
                    navigate("/");
                }
                return response;
            });
    }

    return (<>
        <div className={shadow + "card text-start px-3 py-2 mb-3"}
            key={post.id}
            style={{ transition: "0.1s" }}
            onMouseEnter={() => { clickable && setShadow("shadow ") }}
            onMouseLeave={() => { clickable && setShadow("") }}
            onClick={() => { clickable && navigate(`/posts/?post_id=${post.id}`) }}>

            <div className='row'>
                <div className='col-auto pe-0'>
                    <h3>{post.title}</h3>
                </div>
                <div className='col-auto pt-2 ps-2 pe-1'>
                    <p className='text-secondary'>
                        {" · \u00A0"}Posted by {post.username} {humanReadableDuration(createdOffset)} ago
                    </p>
                </div>
                {createdOffset !== updatedOffset &&
                    <div className='col-auto ps-1 pt-2'>
                        <p className='text-secondary'>
                            <p className='text-secondary fst-italic'>
                                {" · \u00A0edited " + humanReadableDuration(updatedOffset) + " ago"}
                            </p>
                        </p>
                    </div>
                }
                {!clickable && post.user_id === authData.user?.id &&
                    <div className='col-auto ms-auto'>
                        <button className='btn btn-outline-secondary dropdown-toggle' data-bs-toggle="dropdown">...</button>
                        <ul className='dropdown-menu dropdown-menu-end'>
                            <li className='dropdown-item' onClick={() => navigate(`/posts/edit/?post_id=${post.id}`)}>Edit</li>
                            <li className='dropdown-item text-danger' onClick={() => setShowModal(true)}>Delete</li>
                        </ul>
                    </div>
                }
            </div>
            <div className='row mb-2'>
                <div className='col-auto'>Tags:</div>
                {post.tags?.map((tag: string) =>
                    <div className='col-auto me-2 py-1 badge rounded-pill text-bg-secondary'>{tag}</div>)}
            </div>
            <div className='mt-1 mb-2'>
                {post.body.split('\n').map((str: string) => <p className='mb-0'>{str ? str : "\u00A0"}</p>)}
            </div>
            <div className='row'>
                <div className='col-auto pt-1'>
                    {/* Use updated comment counts when comments are edited/deleted but post not refetched */}
                    <h5>{commentCount !== post.comment_count ? commentCount : post.comment_count} Comments</h5>
                </div>
            </div>
        </div>
        {/* Popup confirmation when deleting post */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Delete Post
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

export default Post