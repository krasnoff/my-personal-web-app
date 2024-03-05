import path from 'path';
import fs from 'fs';

export const getJSONData = async (fileDir: string) => {
    const getPostPromise = new Promise((resolve, reject) => {
        const postsJSONFile = path.join(process.cwd(), fileDir);
        fs.readFile(postsJSONFile, (err, data) => {
            if (err) {
                reject(err);
            }
            const parseData = JSON.parse(data.toString());
            resolve(parseData);
        })
    });
    
    return await getPostPromise;
}