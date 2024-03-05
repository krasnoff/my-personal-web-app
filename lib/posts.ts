import path from 'path';
import fs from 'fs';

const getPostPromise = new Promise((resolve, reject) => {
    const postsJSONFile = path.join(process.cwd(), './public/json/posts.json');
    fs.readFile(postsJSONFile, (err, data) => {
        if (err) {
            reject(err);
        }
        const parseData = JSON.parse(data.toString());
        resolve(parseData);
    })
});

export const getPosts = async () => {
    return await getPostPromise;
}