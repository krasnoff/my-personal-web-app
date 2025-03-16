import { Posts } from "@/interfaces/posts";
import Link from "next/link";

interface Props {
    post: Posts
}

export default function Post(props: Props) {
    return (
        <Link href={`/posts/${props.post.id}`}>
            <h2 className="font-bold text-[1.625rem] line-clamp-2">{props.post.title}</h2>
            <div className=" pt-[1.2rem] pb-[1.2rem]">{props.post.publishDate as string}   |   {props.post.keyWords}</div>
            <div className="line-clamp-4">
                {props.post.text}
            </div>
        </Link>
    );
}