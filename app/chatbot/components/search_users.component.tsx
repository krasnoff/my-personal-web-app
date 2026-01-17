export interface DataObject {
  total_count: number
  incomplete_results: boolean
  items: Item[]
}

export interface Item {
  login: string
  id: number
  profile_url: string
  avatar_url: string
}

export interface SearchUsersProps {
    data: DataObject;
}

export default function SearchUsers({data}: SearchUsersProps) {
    

    return (
        <div className="flex width-full justify-between">
            {data.items && data.items?.length > 0 ? (
            <>
                <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-semibold mb-2">User: {data.items[0].login}</h2>
                    <div><a href={data.items[0].profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-red-600">{data.items[0].profile_url}</a></div>
                </div>
                <div>
                    <img src={data.items[0].avatar_url} alt={`${data.items[0].login} avatar`} width={200} height={200} />
                </div>
            </>
            ) : null}
        </div>
    );
}