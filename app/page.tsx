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
    workData = workData.slice(0, 3);
  } catch (err) {

  }
  
  return (
      <>
        <div className="mx-auto max-w-innerFrame flex items-stretch mt-32 flex-col">
          <div className="flex flex-row">
            <div className="flex-1 flex flex-col">
              <h1 className="font-bold text-5xl leading-tight">
                Hi, I am Kobi,<br></br>
                Front End developer
              </h1>
              <div className="flex-1 flex items-end pr-20">
              Passionate and proficient developer adept in React, TypeScript, CSS, and Tailwind, crafting seamless digital experiences with creativity and precision.
              </div>
            </div>
            <div className="size-60 rounded-full bg-[url('/img/portrait.jpg')] bg-cover"></div>
          </div>
          <div className="mt-10">
            <Link className="primary-button" href="pdf/cv.pdf" target="_blank">Download Resume</Link>
          </div>
        </div>
        <div className="mt-20 h-[24.75rem] bg-[#EDF7FA]">
          <div className="mx-auto max-w-innerFrame flex items-stretch flex-col h-full">
            <div className="h-[3.9375rem] flex items-center justify-between">
              <div className="text-[1.375rem]">Recent Posts</div>
              <div><Link href="/blog" className="text-secondary">View all</Link></div>
            </div>
            <div className="flex grow items-start justify-between">
              {postData.map((post) => (
                <div key={post.id} className="bg-white w-[26.125rem] h-[18.4375rem] rounded drop-shadow pt-[1.8rem] pb-[1.875rem] pl-[1rem] pr-[2.6875rem]">
                  <Post post={post}></Post>
                </div>
              ))}  
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto max-w-innerFrame h-[3.9375rem] flex items-center justify-between pt-[2.125rem] pb-[3.0625rem]">
            <div className="text-[1.375rem]">Featured Works</div>
            <div><Link href="/blog" className="text-secondary">View all</Link></div>
          </div>
          {workData.map((workItem) => (
            <Works workItem={workItem}></Works>
          ))}  
        </div>
      </>
  );
}