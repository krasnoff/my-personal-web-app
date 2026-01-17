export interface DataObject {
  total_count: number
  incomplete_results: boolean
  items: Item[]
}

export interface Item {
  name: string
  path: string
  sha: string
  html_url: string
  repository: Repository
}

export interface Repository {
  id: number
  node_id: string
  owner: Owner
  name: string
  full_name: string
  description?: string
  html_url: string
  fork: boolean
  private: boolean
  url: string
  archive_url: string
  assignees_url: string
  blobs_url: string
  branches_url: string
  collaborators_url: string
  comments_url: string
  commits_url: string
  compare_url: string
  contents_url: string
  contributors_url: string
  deployments_url: string
  downloads_url: string
  events_url: string
  forks_url: string
  git_commits_url: string
  git_refs_url: string
  git_tags_url: string
  hooks_url: string
  issue_comment_url: string
  issue_events_url: string
  issues_url: string
  keys_url: string
  labels_url: string
  languages_url: string
  merges_url: string
  milestones_url: string
  notifications_url: string
  pulls_url: string
  releases_url: string
  stargazers_url: string
  statuses_url: string
  subscribers_url: string
  subscription_url: string
  tags_url: string
  trees_url: string
  teams_url: string
}

export interface Owner {
  login: string
  id: number
  node_id: string
  avatar_url: string
  html_url: string
  gravatar_id: string
  type: string
  site_admin: boolean
  url: string
  events_url: string
  following_url: string
  followers_url: string
  gists_url: string
  organizations_url: string
  received_events_url: string
  repos_url: string
  starred_url: string
  subscriptions_url: string
}


export interface SearchCodeProps {
    data: DataObject;
}

export default function SearchCode({data}: SearchCodeProps) {
    return (
        <div className="flex width-full justify-between">
            {data.items && data.items?.length > 0 ? (
            <>
                <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>Repository</th>
                        <th>link</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((codeItem, index) => (
                        <tr key={codeItem.sha} className="border-t border-gray-300">
                            <td>{codeItem.name}</td>
                            <td><a href={codeItem.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-red-600">{codeItem.repository.full_name}</a></td>
                            <td><a href={codeItem.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-red-600">View Code</a></td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </>
            ) : <div>nothing was found</div>}
        </div>
    );
}