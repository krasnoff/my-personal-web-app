import { Posts } from "@/interfaces/posts";

interface Props {
    post: Posts
}

export default function Post(props: Props) {
    return (
        <>
            <div className="font-bold text-[1.625rem] line-clamp-2">{props.post.title}</div>
                <div className=" pt-[1.2rem] pb-[1.2rem]">{props.post.publishDate as string}   |   {props.post.keyWords}</div>
                <div className="line-clamp-4">
                {props.post.text}
            </div>
        </>
    );
}