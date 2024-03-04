import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";

// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData();
//   return {
//     props: {
//       allPostsData,
//     },
//   };
// }


export default function Home({ allPostsData }: any) {
  
  console.log('allPostsData', allPostsData);
  
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
            <div className="flex grow items-start">
              <div className="bg-white w-[26.125rem] h-[18.4375rem] rounded drop-shadow pt-[1.8rem] pb-[1.875rem] pl-[1rem] pr-[2.6875rem]">
                <div className="font-bold text-[1.625rem]">Making a design system from scratch</div>
                <div className=" pt-[1.2rem] pb-[1.2rem]">12 Feb 2020   |   Design, Pattern</div>
                <div>
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}


// export const getStaticProps = () => ({
//   props: {
//     hello: 'world',
//   },
// })
