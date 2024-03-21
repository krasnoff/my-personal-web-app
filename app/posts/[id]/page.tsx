import { Posts } from "@/interfaces/posts";
import { getJSONData } from "@/lib/posts";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
    let postDataArr: Posts[] = [];
    let postData: Posts | undefined;

    const options: Intl.DateTimeFormatOptions  = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    try {
        postDataArr = await getJSONData('./json/posts.json') as Posts[];
        postData = postDataArr.find(el => el.id?.toString() === params.id);
    } catch (err) {

    }

    const publishDate =  (new Date((postData as Posts).publishDate)).toLocaleDateString("en-US", options);
    
    return (
        <div className="mx-auto max-w-innerFrame flex items-stretch mt-4 flex-col px-5 sm:px-0">
            {postData && 
                <>
                    <div className="max-w-innerFrame font-bold text-4xl mt-4 mb-3">{postData.title}</div>
                    <div className="mb-4">
                        <div className="font-bold underline">Publish Date:</div>
                        {publishDate}
                    </div>
                    <div className="mb-4">{postData.text}</div>
                    <div className="mb-4">
                        <div className="font-bold underline">Tech Stack:</div>
                            {postData.keyWords}
                        </div>
                    <div>
                        Link to the full article: <Link href={postData.url} target="_blank" className="text-blue-600 hover:underline">{postData.url}</Link>
                    </div>
                </>
            }
        </div>
    );
}