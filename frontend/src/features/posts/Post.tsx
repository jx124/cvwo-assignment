import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ButtonGroup from "./ButtonGroup";

function Post(props: any) { // TODO: fix any type
    const post = props.post;
    const [shadow, setShadow] = useState("");
    const navigate = useNavigate();
    const linkTo = (link: string) => {
      navigate(link);
    }
  
    return (
        <div className={shadow + "card text-start px-3 py-2"}
            key={post.id}
            style={{ margin: "5em", transition: "0.1s"}}
            onMouseEnter={() => setShadow("shadow ")}
            onMouseLeave={() => setShadow("")}
            onClick={() => linkTo(`/posts/?post_id=${post.id}`)}>

            <h3>{post.title}</h3>
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
                <div className='col-auto ms-auto'>
                    <ButtonGroup
                        post_id={props.post.id}
                        dispatch={props.dispatch}
                    />
                </div>
            </div>
            {/* <h3>Created by: {post.user_id}</h3> */}

        </div>
    )
}

export default Post