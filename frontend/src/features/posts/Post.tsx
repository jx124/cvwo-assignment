import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { AppDispatch } from '../../app/store';
import { selectAuthData } from '../auth/authSlice';
import { humanReadableDuration } from '../utils/humanReadableDuration';
import { destroyPostAsync } from './postSlice';

function Post(props: any) { // TODO: fix any type
    const post = props.post;
    const clickable = props.clickable;
    const [shadow, setShadow] = useState("");

    const postCreatedTime = new Date(post.created_at ? post.created_at : 0).getTime();
    const postUpdatedTime = new Date(post.updated_at ? post.updated_at : 0).getTime();
    const currentTime = new Date().getTime();
    const createdOffset = currentTime - postCreatedTime;
    const updatedOffset = currentTime - postUpdatedTime;

    const navigate = useNavigate();
    const linkTo = (link: string) => {
        navigate(link);
    }

    const dispatch = useDispatch<AppDispatch>();

    const authData = useAppSelector(selectAuthData);

    const handleDeleteClick = async () => {
        const payload = {
            post: {
                post_id: post.id,
            },
            token: authData.token ? authData.token : "",
        }
        console.log("click: ", payload);

        await dispatch(destroyPostAsync(payload))
            .then((response: any) => {
                console.log("handleDeleteClick response:", response);
                if (!("error" in response.payload)) {
                    navigate("/");
                }
                return response;
            });
    }

    return (
        <div className={shadow + "card text-start px-3 py-2"}
            key={post.id}
            style={{ margin: "5em", transition: "0.1s" }}
            onMouseEnter={() => { clickable && setShadow("shadow ") }}
            onMouseLeave={() => { clickable && setShadow("") }}
            onClick={() => { clickable && linkTo(`/posts/?post_id=${post.id}`) }}>

            <div className='row'>
                <div className='col-auto pe-0'>
                    <h3>{post.title}</h3>
                </div>
                <div className='col-auto pt-2 ps-2 pe-1'>
                    <p className='text-secondary'>
                        {" · \u00A0"}Posted by {post.user_id} {humanReadableDuration(createdOffset)} ago
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
                {!clickable &&
                    <div className='col-auto ms-auto'>
                        <button className='btn btn-outline-secondary dropdown-toggle' data-bs-toggle="dropdown">...</button>
                        <ul className='dropdown-menu dropdown-menu-end'>
                            <li className='dropdown-item' onClick={() => linkTo(`/posts/edit/?post_id=${post.id}`)}>Edit</li>
                            <li className='dropdown-item text-danger' onClick={handleDeleteClick}>Delete</li>
                        </ul>
                    </div>
                }
            </div>
            <div className='row mb-2'>
                <div className='col-auto'>Tags:</div>
                {post.tags?.map((tag: string) =>
                    <div className='col-auto me-2 py-1 badge rounded-pill text-bg-secondary'>{tag}</div>)}
            </div>
            <p>{post.body}</p>
            <div className='row'>
                <div className='col-auto pt-1'>
                    <h5>
                        ᐃ {post.rating} ᐁ
                    </h5>
                </div>
                <div className='col-auto pt-1'>
                    <h5>Comments</h5>
                </div>
                <div className='col-auto pt-1'>
                    <h5>Posted by: {post.user_id}</h5>
                </div>
            </div>
        </div>
    )
}

export default Post