export interface DataObject {
  total_count: number
  incomplete_results: boolean
  items: Item[]
}

export interface Item {
  id: number
  name: string
  full_name: string
  description?: string
  html_url: string
  language?: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
  created_at: string
  private: boolean
  fork: boolean
  archived: boolean
  default_branch: string
}

export interface SearchRepositoriesProps {
    data: DataObject;
}

export default function SearchRepositories({data}: SearchRepositoriesProps) {
    return (
        <div className="flex width-full justify-between">
            {data.items && data.items?.length > 0 ? (
            <>
                <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((repo) => (
                        <tr key={repo.id} className="border-t border-gray-300">
                            <td className="px-4 py-2">{repo.full_name}</td>
                            <td className="px-4 py-2">{repo.description}</td>
                            <td className="px-4 py-2">
                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-red-600">
                                    Link to Repository
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </>
            ) : <div>nothing was found</div>}
        </div>
    );
}