import { Projects } from "@/interfaces/projects";
import { getJSONData } from "@/lib/posts";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
    let workDataArr: Projects[];
    let workData: Projects | undefined;

    try {
        workDataArr = await getJSONData('./json/projects.json') as Projects[];
        workData = workDataArr.find(el => el.id?.toString() === params.id);
      } catch (err) {
    
    }
    
    return (
        <div className="mx-auto max-w-innerFrame flex items-stretch mt-4 flex-col px-5 sm:px-0">
            {workData && 
                <>
                    <div className="max-w-innerFrame font-bold text-4xl mt-4 mb-3">{workData.title}</div>
                    <div className="mb-4">{workData.description}</div>
                    <div className="mb-4">
                        <div className="font-bold underline">Tech Stack:</div>
                            {workData.keywords}
                        </div>
                    <div>
                        Link to application site: <Link href={workData.url} target="_blank" className="text-blue-600 hover:underline">{workData.url}</Link>
                    </div>
                    <div>
                        Link to GIT source code: <Link href={workData.gitUrl} target="_blank" className="text-blue-600 hover:underline">{workData.gitUrl}</Link>
                    </div>
                </>
            }
        </div>
    );
}