import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useAppSelector } from '../../app/hooks';
import { AuthStatuses, selectAuthData, selectAuthStatus } from '../auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { useForm } from 'react-hook-form';
import { CommentFormInput, createCommentAsync, CreateCommentRequest } from './commentSlice';
import { useSearchParams } from 'react-router-dom';

const commentSchema = yup.object({
    body: yup
        .string()
        .min(5, "Comment must contain at least 5 characters")
        .max(1000, "Comment cannot exceed 500 characters")
        .strict()
        .required("Comment cannot be empty")
})

function CommentForm(props: any) { // TODO: change todo type
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormInput>({
        resolver: yupResolver(commentSchema),
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const postId = parseInt(searchParams.get("post_id") + "");

    const authData = useAppSelector(selectAuthData);
    const authStatus = useAppSelector(selectAuthStatus);
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (input: CommentFormInput) => {
        // build request from input
        const request = {
            data: {
                body: input.body,
                post_id: postId,
                user_id: authData.user ? authData.user.id : 0,
            },
            token: authData.user ? authData.token : "",
        } as CreateCommentRequest

        console.log("create comment request: ", request)

        await dispatch(createCommentAsync(request))
            .then((response) => {
                console.log("create comment response: ", response);
                reset();
                return response;
            });
    }

    return (<div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='card' style={{ margin: "5em" }}>
                <div className='card-body px-3 py-2'>
                    <div className='mb-1'>
                        <textarea className='form-control text-start'
                            style={{ height: "100px" }}
                            placeholder="Add your comment here."
                            {...register("body")} />
                    </div>
                    <div className='row'    >
                        <div className='col-auto form-text text-danger'>
                            {errors.body?.message}
                        </div>
                        <div className='col-auto ms-auto'>
                            <input type="submit"
                                className='btn btn-secondary btn-sm form-control'
                                disabled={!(authStatus === AuthStatuses.LoggedIn)}
                                value="Add Comment" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>)
}

export default CommentForm