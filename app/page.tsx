import Post from "@/components/post";
import Works from "@/components/work";
import { Posts } from "@/interfaces/posts";
import { Projects } from "@/interfaces/projects";
import { getJSONData } from "@/lib/posts";
import Link from "next/link";

export default async function Home() {
  let postData: Posts[] = [];
  let workData: Projects[] = [];


  const options: Intl.DateTimeFormatOptions  = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
     
  try {
    postData = await getJSONData('./json/posts.json') as Posts[];
    postData = postData.slice(0, 2);
    postData.forEach(el => {
      const dateObj: Date = new Date(el.publishDate);
      el.publishDate = dateObj.toLocaleDateString("en-US", options);
    })
  } catch (err) {

  }

  try {
    workData = await getJSONData('./json/projects.json') as Projects[];
    workData = workData.slice(0, 4);
  } catch (err) {

  }
  
  return (
      <>
        <div className="mx-auto max-w-innerFrame flex items-stretch mt-10 sm:mt-32 flex-col">
          <div className="flex flex-col-reverse sm:flex-row items-center">
            <div className="flex-1 flex flex-col text-center sm:text-left">
              <h1 className="font-bold text-5xl leading-tight mb-10 sm:mb-0">
                Hi, I am Kobi,<br></br>
                Front End developer
              </h1>
              <div className="flex-1 flex items-end pr-10 pl-10 sm:pr-20 sm:pl-0">
              Passionate and proficient developer adept in React, TypeScript, CSS, and Tailwind, crafting seamless digital experiences with creativity and precision.
              </div>
            </div>
            <div className="size-60 rounded-full bg-[url('/img/portrait.jpg')] bg-cover mb-10 sm:mb-0"></div>
          </div>
          <div className="mt-10 flex justify-center sm:justify-start">
            <Link className="primary-button" href="pdf/cv.pdf" target="_blank">Download Resume</Link>
          </div>
        </div>
        <div className="mt-20 sm:h-[24.75rem] bg-[#EDF7FA]">
          <div className="mx-auto sm:max-w-innerFrame flex items-stretch flex-col h-full">
            <div className="h-[3.9375rem] flex items-center justify-between px-5 sm:px-0">
              <h2 className="text-[1.375rem]">Recent Posts</h2>
              <div><Link href="/posts" className="text-secondary">View all</Link></div>
            </div>
            <div className="flex grow items-center gap-y-5 sm:gap-0 sm:items-start justify-between flex-col sm:flex-row pb-5 sm:pb-0">
              {postData.map((post) => (
                <div key={post.id} className="bg-white w-[90%] sm:w-[26.125rem] h-[18.4375rem] rounded drop-shadow pt-[1.8rem] pb-[1.875rem] pl-[1rem] pr-[2.6875rem]">
                  <Post post={post}></Post>
                </div>
              ))}  
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto max-w-innerFrame h-[3.9375rem] flex items-center justify-between pt-[2.125rem] pb-[3.0625rem] px-5 sm:px-0">
            <h2 className="text-[1.375rem]">Featured Works</h2>
            <div><Link href="/works" className="text-secondary">View all</Link></div>
          </div>
          {workData.map((workItem) => (
            <Works workItem={workItem} key={workItem.id}></Works>
          ))}  
        </div>
      </>
  );
}