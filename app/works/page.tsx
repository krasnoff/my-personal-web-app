import Works from "@/components/work";
import { Projects } from "@/interfaces/projects";
import { getJSONData } from "@/lib/posts";

export default async function Posts() {
    let workData: Projects[] = [];

    try {
        workData = await getJSONData('./json/projects.json') as Projects[];
    } catch (err) {
    
    }

    return (
        <>
            <h1 className="mx-auto max-w-innerFrame font-bold text-5xl mt-4 mb-8 pl-5 sm:pl-0">Works</h1>
            {workData.map((workItem) => (
                <Works workItem={workItem} key={workItem.id}></Works>
            ))}
        </>
    );
}