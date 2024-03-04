import path from 'path';
import fs from 'fs';
import { Posts } from '@/interfaces/posts';

export function getSortedPostsData() {
    const postsJSONFile = path.join(process.cwd(), 'json/posts.json');
    const fileNames = fs.readdirSync(postsJSONFile);
}