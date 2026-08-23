import Works from "@/components/work";
import { Projects } from "@/interfaces/projects";
import { getJSONData } from "@/lib/posts";
import JsonLd from "@/components/jsonLd";
import { SITE_URL, WEBSITE_ID } from "@/lib/schema";

export default async function Posts() {
    let workData: Projects[] = [];

    try {
        workData = await getJSONData('./json/projects.json') as Projects[];
    } catch (err) {
    
    }

    return (
        <>
            <title>Kobi Krasnoff - Works list</title>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "@id": `${SITE_URL}/works#collection`,
                    url: `${SITE_URL}/works`,
                    name: "Software projects by Kobi Krasnoff",
                    isPartOf: { "@id": WEBSITE_ID },
                    mainEntity: {
                        "@type": "ItemList",
                        itemListElement: workData.map((work, index) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            url: `${SITE_URL}/works/${work.id}`,
                            name: work.title,
                        })),
                    },
                }}
            />
            <h1 className="mx-auto max-w-innerFrame font-bold text-5xl mt-4 mb-8 pl-5 sm:pl-0">Works</h1>
            {workData.map((workItem) => (
                <Works workItem={workItem} key={workItem.id}></Works>
            ))}
        </>
    );
}
