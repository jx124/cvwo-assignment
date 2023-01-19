import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store';
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { createPostAsync, CreatePostRequest, PostFormInput } from './postSlice';
import { useAppSelector } from '../../app/hooks';
import { selectAuthData } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

const tagSchema = yup.object({
  item: yup.string().min(1).max(30).required(),
})

const postSchema = yup.object({
  title: yup.string().min(5).max(50).required(),
  body: yup.string().min(5).max(500).required(),
  tags: yup.array().of(tagSchema).min(1).max(4),
})

function PostForm() {
  const dispatch = useDispatch<AppDispatch>();
  const authData = useAppSelector(selectAuthData);
  const navigate = useNavigate();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<PostFormInput>({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "Post title",
      body: "Post body.",
      tags: [
        { item: "Tag 1" },
        { item: "Tag 2" },
        { item: "Tag 3" },
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control
  });

  async function onSubmit(data: PostFormInput) {
    console.log("data: ", data);
    console.log("token: ", authData.token);
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

    const createPostRequestData: CreatePostRequest = {
      post: {
        title: data.title,
        body: data.body,
        tags: newTagsArray,
        rating: 0,
        user_id: authData.user?.id ? authData.user?.id : 0,
      },
      token: authData.token ? authData.token : "",
    }
    console.log("request: ", createPostRequestData);

    await dispatch(createPostAsync(createPostRequestData))
      .then((response) => {
        console.log("response: ", response);
        // redirect to previous page if login successful
        if (!("error" in response.payload)) {
          navigate(-1);
      }
      return response;
      })
  }

  return (
    <div className='App container'>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} id="postform">
        <input type="text" placeholder='Title' {...register("title")} />
        <p>{errors.title?.message}</p>
        <textarea {...register("body")}>Enter post body here.</textarea>
        <p>{errors.body?.message}</p>
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <section key={field.id}>
                <input type="text" placeholder='Enter tag here' {...register(`tags.${index}.item` as const)} />
                <button type="button" onClick={() => remove(index)}>
                  Delete
                </button>
                <p>{errors.tags?.[index]?.message}</p>

              </section>
            </div>
          )
        })}
        <button type="button" onClick={() => append({ item: "New Tag" })}>Add Tag</button>
        <input type="submit" value="Submit" />
      </form>

    </div>
  )
}

export default PostForm