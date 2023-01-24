import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store';
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { createPostAsync, CreatePostRequest, PostFormInput, selectPosts, selectPostStatus, updatePostAsync, UpdatePostRequest } from './postSlice';
import { useAppSelector } from '../../app/hooks';
import { selectAuthData } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toInteger } from 'lodash';

const tagSchema = yup.object({
    item: yup
        .string()
        .max(30, "Tag cannot exceed 30 characters")
        .strict()
        .required("Tag cannot be empty"),
})

const postSchema = yup.object({
    title: yup
        .string()
        .min(5, "Title must contain at least 5 characters")
        .max(100, "Title cannot exceed 100 characters")
        .strict()
        .required("A post title is required"),
    body: yup
        .string()
        .min(5, "Body must contain at least 5 characters")
        .max(500, "Body cannot exceed 500 characters")
        .strict()
        .required("A post body is required"),
    tags: yup
        .array()
        .of(tagSchema)
        .test("unique", "Tags need to be unique", values => {
            return (new Set(values?.map(obj => obj.item))).size === values?.length;
        })
        .min(1)
        .max(4)
        .strict()
        .required(),
})

function EditPostForm(props: any) { // TODO: fix any type
    const dispatch = useDispatch<AppDispatch>();
    const authData = useAppSelector(selectAuthData);
    const post = useAppSelector(selectPosts)
    const navigate = useNavigate();

    let autofillPostContent = {
        title: "Post title",
        body: "Post body",
        tags: [
            { item: "General" },
        ]
    }

    if (post[0]) {
        autofillPostContent.title = post[0].title + "";
        autofillPostContent.body = post[0].body + "";
        
        // convert from "tags: string[]" to "tags: { item: string; }[]"
        autofillPostContent.tags = post[0].tags 
            ? post[0].tags.map((tag) => {
                return { item: tag }
            }) 
            : [];
    }

    const { register, control, handleSubmit, formState: { errors } } = useForm<PostFormInput>({
        resolver: yupResolver(postSchema),
        defaultValues: autofillPostContent,
    });

    const { fields, append, remove } = useFieldArray({
        name: "tags",
        control
    });

    async function onSubmit(data: PostFormInput) {
        /* Convert from
    
            tags: {
                item: string;
            }[]
    
        object array in PostFormInput to 
    
            tags: string[]
        
        string array to match backend api
        */
        let newTagsArray: string[] = [];

        for (let index in data.tags) {
            newTagsArray.push(data.tags[index].item);
        }

        const updatePostRequestData: UpdatePostRequest = {
            post_id: post[0].id ? post[0].id : 0,
            post: {
                title: data.title,
                body: data.body,
                tags: newTagsArray,
                user_id: authData.user?.id ? authData.user?.id : 0,
            },
            token: authData.token ? authData.token : "",
        }

        await dispatch(updatePostAsync(updatePostRequestData))
            .then((response) => {
                // redirect to previous page if edit successful
                if (!("error" in response.payload)) {
                    navigate(-1);
                }
                return response;
            })
    }

    function renderTags(fields: FieldArrayWithId<PostFormInput, "tags", "id">[]) {
        return fields.map((field, index) => {
            return (
                <div key={field.id} className="mb-1">
                    <section key={field.id}>
                        <div className='row'>
                            <div className='col-auto'>
                                <input type="text"
                                    className="form-control"
                                    placeholder='Enter tag here'
                                    {...register(`tags.${index}.item` as const)} />
                            </div>
                            <div className='col-auto'>
                                <button type="button"
                                    className='btn btn-danger form-control'
                                    disabled={fields.length <= 1}
                                    onClick={() => remove(index)}>Delete</button>
                            </div>
                            <div className="form-text text-danger" style={{ height: "21px" }}>
                                {errors.tags?.[index]?.item?.message}
                            </div>
                        </div>
                    </section>
                </div>
            )
        })
    }

    return (
        <div className='App container'>
            <form onSubmit={handleSubmit(onSubmit)} id="postform">
                <div className='card' style={{ margin: "5em" }}>
                    <div className='card-body text-start'>
                        <h1>Edit Post</h1>
                        <div className='mb-1'>
                            <label htmlFor="formTitle" className="form-label fs-5">Title</label>
                            <input type="text"
                                className="form-control"
                                id="formTitle"
                                {...register("title")} />
                            <div className="form-text text-danger" style={{ height: "21px" }}>
                                {errors.title?.message}
                            </div>
                        </div>
                        <div className='mb-1'>
                            <label htmlFor="formBody" className="form-label fs-5">Body</label>
                            <textarea className="form-control"
                                id="formBody"
                                style={{ height: "100px" }}
                                {...register("body")}>Enter post body here.</textarea>
                            <div className="form-text text-danger" style={{ height: "21px" }}>
                                {errors.body?.message}
                            </div>
                        </div>
                        <div className='mb-1'>
                            <label htmlFor="formTags" className="form-label fs-5">Tags</label>
                            {renderTags(fields)}
                            <div className="form-text text-danger" style={{ height: "21px" }}>
                                {errors.tags?.message}
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-auto pe-0">
                                <button type="button"
                                    className='btn btn-secondary form-control'
                                    disabled={fields.length >= 4}
                                    onClick={() => append({ item: "New Tag" })}>Add Tag</button>
                            </div>
                            <div className="col-auto">
                                <input type="submit"
                                    className="btn btn-primary form-control"
                                    value="Submit" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditPostForm