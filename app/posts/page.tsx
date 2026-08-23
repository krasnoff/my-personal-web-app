import React from "react";
import Post from "@/components/post";
import { Posts as PostObj } from "@/interfaces/posts";
import { getJSONData } from "@/lib/posts";
import JsonLd from "@/components/jsonLd";
import { SITE_URL, WEBSITE_ID } from "@/lib/schema";

export default async function Posts() {
    let postData: PostObj[] = [];

    const options: Intl.DateTimeFormatOptions  = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    try {
        postData = await getJSONData('./json/posts.json') as PostObj[];
        postData.forEach(el => {
          const dateObj: Date = new Date(el.publishDate);
          el.publishDate = dateObj.toLocaleDateString("en-US", options);
        })
      } catch (err) {
        console.log('error in json read...', err);
    }
    
    return (
        <>
            <title>Kobi Krasnoff - Posts list</title>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "@id": `${SITE_URL}/posts#collection`,
                    url: `${SITE_URL}/posts`,
                    name: "Technical articles by Kobi Krasnoff",
                    isPartOf: { "@id": WEBSITE_ID },
                    mainEntity: {
                        "@type": "ItemList",
                        itemListElement: postData.map((post, index) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            url: `${SITE_URL}/posts/${post.id}`,
                            name: post.title,
                        })),
                    },
                }}
            />
            <h1 className="mx-auto max-w-innerFrame font-bold text-5xl pl-4 mt-4">Posts</h1>
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
