export default function Page({ params }: { params: { id: string } }) {
    return (
        <>
            <div className="mx-auto max-w-innerFrame font-bold text-5xl pl-4 mt-4">Works</div>
            <div className="mx-auto max-w-innerFrame flex items-stretch mt-4 flex-col">
                data: {params.id}
            </div>
        </>
    );
}