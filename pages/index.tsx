// import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

const Home = ({ posts }: Props) => {
  console.log(posts)

  return (
    <div className="">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="max-w-7xl mx-auto grid grid-cols-2 items-center bg-yellow-400 border-y border-black md:py-10 py-0">
        <div className="px-10 space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4 mr-2">
              Medium
            </span>
            is a place to write read and connect
          </h1>
          <h2>
            it's is easy and free to post your thinking on any topic and connect
            with millions of readers.
          </h2>
        </div>
        <div className=" h-32 lg:h-full text-center">
          <h1 className="md:text-[300px] font-black font-serif ">M</h1>
        </div>
      </div>
      {
        // Post
      }
      <div className="max-w-7xl mx-auto ">
        {posts.map((post) => {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
              <Link key={post._id} href={`/post/${post.slug.current}`}>
                <div className="cursor-pointer border rounded-lg group overflow-hidden">
                  <img
                    src={urlFor(post.mainImage).url()!}
                    alt=""
                    className="w-full h-60 object-cover group-hover:scale-105 transform duration-300 transition-all ease-in-out"
                  />
                  <div className="flex justify-between p-5">
                    <div>
                      <p className='font-medium '> {post.title} </p>
                      <p>
                        {post.description} by <span className="text-green-800 font-medium">{post.author.name}</span>
                      </p>
                    </div>
                    <img
                      src={urlFor(post.author.image).url()!}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
    name, image,
  },
  description,
  mainImage,
  slug
  }`

  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}
