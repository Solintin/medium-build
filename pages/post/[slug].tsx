import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortabelText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Props {
  post: Post
}

interface IFormInput {
  _id: string
  name: string
  comment: string
  email: string
}

const Post = ({ post }: Props) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [submitted, setSubmitted] = React.useState(false)
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(!submitted)
      })
      .catch((error) => {
        console.log(error)
        setSubmitted(false)
      })
  }
  return (
    <main>
      <Header />

      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3"> {post.title} </h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="rounded-full w-10 h-10"
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className="font-extralight">
            Blog Post by{' '}
            <span className="text-green-500 font-medium">
              {post.author.name}
            </span>{' '}
            - Published at
            <span className="ml-1">
              {new Date(post.publishedAt).toLocaleString()}
            </span>
          </p>
        </div>

        <div>
          <PortabelText
            className="mt-10["
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
          />
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      {submitted ? (
        <div className="flex flex-col text-center py-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h1 className="text-xl  font-bold">
            Thanks for submitting your comment
          </h1>
          <p>Once It has been approved,you will see it below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500"> Enjoy this Article </h3>
          <h3 className="text-3xl font-bold"> Leave a comment below</h3>

          <hr className="py-3 mt-2" />

          <input
            type="hidden"
            {...register('_id')}
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700 ">Name</span>
            <input
              className="shadow border rounded py-2 px-3 form-input mt-1 outline-none block w-full ring-yellow-500  focus:ring-2"
              type="text"
              placeholder="Papa React"
              {...register('name', { required: true })}
            />
            {errors.name && (
              <span className="text-red-500"> The Name Field is Required </span>
            )}
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700 ">Email</span>
            <input
              className="shadow border rounded py-2 px-3 form-input mt-1 outline-none block w-full ring-yellow-500  focus:ring-2"
              type="text"
              placeholder="PapaReact@next.com"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <span className="text-red-500"> The Name Field is Required </span>
            )}
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700 ">Comment</span>
            <textarea
              className="shadow border rounded py-2 px-3 form-textarea outline-none mt-1 block w-full ring-yellow-500  focus:ring-2"
              rows={8}
              placeholder="Papa  Comment"
              {...register('comment', { required: true })}
            />
          </label>
          {errors.comment && (
            <span className="text-red-500"> The Name Field is Required </span>
          )}
          <input
            type="submit"
            value="Comment"
            className="bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline text-white font-bold focus:outline-none py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}
      {/* <Comment comment={post} /> */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-500 space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => {
          return (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}: </span>
                {comment.comment}{' '}
              </p>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[type == "post"]{
        _id,
        slug {
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    createdAt,
    title,
    author->{
        name, 
        image
    },
    'comments': *[
        _type == "comment" &&
        post._ref == ^._id &&
        approved == true],
        description,
        mainImage,
        slug,
        publishedAt,
        body
}`
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60, //update the old cached Data.
  }
}
