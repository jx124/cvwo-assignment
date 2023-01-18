import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store';
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { PostFormInput } from './postSlice';

const tagSchema = yup.object({
  item: yup.string().min(1).max(30).required(),
})

const postSchema = yup.object({
  title: yup.string().min(5).max(50).required(),
  body: yup.string().min(5).max(500).required(),
  tags: yup.array().of(tagSchema).min(1).max(4),
})

function PostForm() {
  // const dispatch = useDispatch<AppDispatch>();
  // const [title, setTitle] = useState("");
  // const [body, setBody] = useState("");
  // const [tags, setTags] = useState({});

  const { register, control, handleSubmit, reset, formState: {errors} } = useForm<PostFormInput>({
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

  function onSubmit(data: PostFormInput) {
    console.log(data);
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