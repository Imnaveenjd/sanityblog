import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { openStdin } from 'process'
import Header from '../components/Header'
import { sanityClient,urlFor} from '../sanity'
import { Post } from '../typings'


/*const Home: NextPage = () => {*/
interface Props{
  posts:[Post];
}
export default function Home({posts}:Props){

  return (
     <div className=''>
      <Head>
        <title>mendium</title>
        <link rel="icon" href="https://cdn3.iconfinder.com/data/icons/social-media-chat-1/512/MeetMe-512.png" />
      </Head>
      <Header/>
      <div  className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
        <div className='space-y-8 px-20'>
        <h1 className='font-serif text-6xl max-w-xl' >Stay curious</h1>
        <h3 className='font-serif text-3xl max-w-xl'>Discover stories, thinking, and expertise from writers on any topic.</h3>
        <button className="  text-2xl bg-black rounded-full text-white px-8 py-2">Start reading</button>
        </div>
        
          <img className='hidden md:inline-flex h-32 lg:h-full' src='https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png'/>
          
        </div>
        <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
          {posts.map((post)=>(
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className='border rounded-lg group cursor-pointer overflow-hidden'>
                <img className='h-60 w-full object-fill group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post.mainImage).url()!} alt=''/>
                <div className='flex justify-between p-5 bg-white'>
                  <div className=''>
                    <p className='text-lg font-bold'>{post.title}</p>
                    <p className='text-xm overflow-hidden'>{post.description} ... <span className='font-semibold'>by {post.author.name}</span></p>
                    </div>
                  <img className=' h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!}/>
                </div>
               </div>
            </Link>
          ))}
        </div>
        </div>
      

      

      
    </div>
  )
}


export const getServerSideProps=async()=>{
  const query=  `*[_type=="post"] {
                              _id,
                   title,
                   slug,
                   author->{
                      name,
                      image,
                    },
                    description,
                    mainImage,
                    slug
                  }`;
  const posts =await sanityClient.fetch(query);

  return{
    props:{
      posts
    }
  }
}
