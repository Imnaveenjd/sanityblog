import { GetStaticProps } from 'next';
import Header from '../../components/Header';
import { Post } from '../../typings';
import { sanityClient,urlFor} from '../../sanity';
import PortableText from 'react-portable-text';
import { useForm ,SubmitHandler} from "react-hook-form";
import { useState } from 'react';
interface IFormInput{
    _id: string;
    name: string;
    email: string;
    comment:string;
}
interface Props{
    post: Post;
}

function Post({post}:Props) {
    const [submitted,setSubmitted]=useState(false);
    const { register, handleSubmit,formState:{errors}} = useForm();
    const onSubmit:SubmitHandler<IFormInput> = (data) => {
        fetch ('/api/createComment',{
            method:'POST',
            body:JSON.stringify(data),
        }).then(()=>{
            console.log(data);
            setSubmitted(true);

        }).catch((err)=>{
            console.log(err);
            setSubmitted(false);
        })
        
    };

  return (
    <main>
        
        <Header />
    <div className=' grid max-w-3xl mx-auto bg-slate-100'>
        <img className='h-80 px-2 w-3/5 rounded-xl mx-auto object-contain group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post.mainImage).url()!} alt=''/>
         <article className='mx-11'>
            <div>
                <h1 className='  text-3xl  font-semibold '>{post.title}</h1>
                <h2 className='text-xl font-light text-gray-500 mt-1 mb-2'>{post.description} by {post.author.name}</h2>
                <div className='flex items-center space-x-1'>
                    <div className='flex items-center'>
                        <img className='  h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!}/>
                         <p className='px-3'>
                        < span className='text-xm font-sans font-normal'>{post.author.name}</ span>
                         </p>
                    </div>
                    <div className=''>
                        
                        < span className='text-gray-500 px-1'>Published at< span> {new Date(post._createdAt).toLocaleDateString('Default', {  day: '2-digit',month: 'short', year: 'numeric' })}</span>
                       </ span>
                    </div>
             </div>
            </div> 
         <div className='mt-10'>
                <PortableText
                className=''
                dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                content={post.body}
                serializers={{ 
                    h1:(props: any) => (
                    <h1 className="text-2xl font-bold my-5" {...props} />
                    ),
                    h2:(props: any) => (
                        <h2 className="text-xl font-bold my-5" {...props} />
                        ),
                    li: ( {children }: any) => (
                        <li className="ml-4 list-disc" >{children}</li>
                        ),
                    link:({href, children}: any) => (
                        <a href={href} className="text-blue-500 hover:underline">
                            {children}
                        </a>
                        ),
                }}
                />
        </div>
        </article>
            
        <div className='mt-10'>
            <hr className='   mx-auto border 2px border-solid border-green-600'/>
        </div>
                
        <div>
        {submitted ? (
        <div className=' flex flex-col py-10 my-10 px-20 mx-auto bg-green-600 text-white '>
            <h3 className='text-3xl font-semibold'>Thanks for submitting your comment !</h3>
            <p>Once it has been approved,it will appear below!</p>
            </div>
        

        ):(
            <form onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col p-5 my-10'>
                        <h3 className='text-sm text-yellow-500' >Enjoyed this article?</h3>
                        <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
                        <hr className='py-3 mt-2'></hr>

                        <input {...register("_id")}
                        type="hidden"
                        name='_id'
                        value={post._id}
                        />
                        
                        <label className='block mb-5'>
                            < span className='text-gray-700' >Name</ span>
                                <input {...register("name",{required:true})} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring ' placeholder='John' type='text'/>
                        </label>
                        <label className='block mb-5'>
                            < span  className='text-gray-700'>Email</ span>
                                <input {...register("email",{required:true})} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='You@email.com' type='email'/>
                        </label>
                        <label className='block mb-5' >
                            < span  className='text-gray-700'>Comment</ span>
                                <textarea {...register("comment",{required:true})} className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring ' placeholder='Enter your comment' rows={8}/>
                        </label>
                        <div className='flex flex-col'>
                            {errors.name&&( <span className='text-red-500' >The Name is required !</span>)}
                            {errors.comment&&( <span className='text-red-500' >The Comment is required !</span>)}
                            {errors.email&&( <span className='text-red-500' >The Email is required !</span>)}
                        </div>
                    <input className='py-2 rounded-full hover:bg-green-500 cursor-pointer focus:shadow-outline focus:outline-none bg-green-600 text-white font-bold px-4' type="submit" />
                </form>
            )}
             <div className="Flex flex-col p-10 my-10 mx-auto shadow-green-500 shadow space-y-2">
                <h3 className="text-4xl">Comments</h3>
                <hr className="pb-2" />

                {post.comments.map((comment) => (
                    <div key={comment._id}>
                        <div className='flex '>
                            <p className='mr-3 font-semibold family-sans text-yellow-500'>{comment.name} :</p>
                            <p>{comment.comment}</p>
                        </div>

                        {/* <p>
                            <span className="text-yellow-500">{comment.name} : </span>{comment.comment}</p> */}
                    </div>
                ))}   
            </div>
        </div>

    </div>
    </main>
  );
  
}

export default Post;
export const getStaticPaths=async ()=> {
    const query= `*[_type=="post" ] {
        _id,
        slug{
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post:Post) => ({
    params:{
        slug: post.slug.current
    }

  }));
  return{
    paths,
    fallback:'blocking'
  };
    
};

export const getStaticProps:GetStaticProps =async ({params}) => {
    const query= `  *[_type=="post" && slug.current ==$slug ][0] {
        _id,
        _createdAt,
        title,
        author->{
        name,
        image,
      },
      'comments':*[
        _type =='comment' &&
        post._ref ==^._id &&
        approved == true
    ],
    description,
    mainImage,
    slug,
    body
    
        
        }`

    const post = await sanityClient.fetch(query,{
        slug:params?.slug,
    });

    if (!post){
        return{
            notFound:true
        }
    }
    return{
        props:{
            post,


    },
    revalidate:60,
    }
    
}
