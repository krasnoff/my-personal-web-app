import { Posts } from "@/interfaces/posts";
import { getJSONData } from "@/lib/posts";
import Link from "next/link";

export default async function Home() {
  let postData: Posts[] = [];
  

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
            <button className="primary-button">Download Resume</button>
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
                  <div className="font-bold text-[1.625rem] line-clamp-2">{post.title}</div>
                  <div className=" pt-[1.2rem] pb-[1.2rem]">{post.publishDate as string}   |   {post.keyWords}</div>
                  <div className="line-clamp-4">
                    {post.text}
                  </div>
                </div>
              ))}  
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto max-w-innerFrame flex items-stretch flex-col h-full pt-[2.125rem] pb-[3.0625rem]">
            <div className="text-[1.375rem]">Featured Works</div>
          </div>
          <div className="flex grow mx-auto max-w-innerFrame pb-[0.875rem] mb-[1.9375rem] border-b">
                <div className="w-[31.375rem]"><img src="/img/1_TSeWgZynzkbsF783uNeO3Q.webp" className="w-[31.375rem] rounded"></img></div>
                <div className="pl-[1.125rem] grow-1">
                  <div className="font-bold text-[1.875rem]">Designing Dashboards</div>
                  <div className="flex py-[1.2rem]">
                    <div className="bg-[#142850] flex text-white font-black text-[1.125rem] px-[0.6875rem] items-center rounded-full">2020</div>
                    <div className="text-[1.25rem] text-light pl-[1.625rem]">Dashboard</div>
                  </div>
                  <div>
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                  </div>
                </div>
          </div>
        </div>
      </>
  );
}