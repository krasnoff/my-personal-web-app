import { Projects } from "@/interfaces/projects";
import Link from "next/link";

interface Props {
    workItem: Projects
}

export default function Works(props: Props) {
    return (
        <Link href={`/works/${props.workItem.id}`}>
            <div key={props.workItem.id} className="flex grow mx-auto max-w-innerFrame pb-[0.875rem] mb-[1.9375rem] border-b">
              <div className="basis-1/5"><img src="/img/1_TSeWgZynzkbsF783uNeO3Q.webp" className="w-full rounded"></img></div>
              <div className="basis-4/5 pl-[1.125rem]">
                <div className="font-bold text-[1.875rem]">{props.workItem.title}</div>
                <div className="flex py-[1.2rem]">
                  <div className="bg-[#142850] flex text-white font-black text-[1.125rem] px-[0.6875rem] items-center rounded-full">{props.workItem.publishYear}</div>
                  <div className="text-[1.25rem] text-light pl-[1.625rem]">{props.workItem.keywords}</div>
                </div>
                <div>
                  {props.workItem.description}
                </div>
              </div>
            </div>
        </Link>
    );
}