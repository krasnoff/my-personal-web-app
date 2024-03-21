import Post from "@/components/post";
import { Posts } from "@/interfaces/posts";
import { getJSONData } from "@/lib/posts";

export default async function Posts() {
    let postData: Posts[] = [];

    const options: Intl.DateTimeFormatOptions  = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    try {
        postData = await getJSONData('./json/posts.json') as Posts[];
        postData.forEach(el => {
          const dateObj: Date = new Date(el.publishDate);
          el.publishDate = dateObj.toLocaleDateString("en-US", options);
        })
      } catch (err) {
        console.log('error in json read...', err);
    }
    
    return (
        <>
            <div className="mx-auto max-w-innerFrame font-bold text-5xl pl-4 mt-4">Posts</div>
            <div className="mx-auto max-w-innerFrame flex items-stretch mt-4 flex-col">
                {postData.map((post) => (
                    <div key={post.id} className="bg-white pt-[1.8rem] pb-[1.875rem] pl-[1rem] pr-[2.6875rem] border-b border-Gray-600">
                        <Post post={post}></Post>
                    </div>
                ))}
            </div>
        </>
    );
}