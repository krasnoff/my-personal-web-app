import path from 'path';
import fs from 'fs';

export const getJSONData = async (fileDir: string) => {
    const getPostPromise = new Promise((resolve, reject) => {
        if (fileDir.indexOf('posts.json') > -1) {
            resolve(getPosts());
        } else if (fileDir.indexOf('projects.json') > -1) {
            resolve(getWorks());
        }
    });
    
    return await getPostPromise;
}

const getWorks = () => {
    return JSON.parse(`[
        {
            "id": "1",
            "publishYear": "2023",
            "keywords": "React, Dashbord",
            "title": "React admin screen",
            "url": "https://react-bootstrap-admin-app.surge.sh/",
            "gitUrl": "https://github.com/krasnoff/bootstrap-admin-app?tab=readme-ov-file",
            "description": "This is an admin template which demonstrate a React app using hooks, bootstrap design system and much more..."
        },
        {
            "id": "2",
            "publishYear": "2023",
            "keywords": "React, Component, Video",
            "title": "Video frame by frame React component",
            "url": "https://www.npmjs.com/package/videoframebyframe",
            "gitUrl": "https://github.com/krasnoff/video-frame-by-frame",
            "description": "This component displays a particular version of an HTML Video element which enables the display of video with the ability to advance or reverse the movie frame by frame."
        },
        {
            "id": "3",
            "publishYear": "2023",
            "keywords": "React, File, Upload",
            "title": "File upload component",
            "url": "https://www.npmjs.com/package/uploadfilereducedsize",
            "gitUrl": "https://github.com/krasnoff/upload-reduced-size-file",
            "description": "This is a React upload component that also reduces the image file size if necessary."
        },
        {
            "id": "4",
            "publishYear": "2023",
            "keywords": "React, Calendar",
            "title": "React hebrew calendar",
            "url": "https://www.npmjs.com/package/hebrewcalendar",
            "gitUrl": "https://github.com/krasnoff/hebrew-canlendar",
            "description": "This component is a simple calendar which displays the gergorian calendar and the hebrew calendar."
        }
    ]`);
}

const getPosts = () => {
    return JSON.parse(`[
        {
            "id": 1,
            "title": "Integrating D3.js to a Typescript React Application",
            "publishDate": "2021-05-02T12:00:00Z",
            "text": "In today's front-end application development, the ReactJS library has become the most popular Javascript/Typescript framework. On the other hand, D3.js is the most commonly used Javascript library for creating dynamic charts on the Web. Integrating the two frameworks and more than that using the Typescript language can be a bit tricky. But it is absolutely possible. That is the purpose of this article.",
            "url": "https://medium.com/p/d77580756b20",
            "keyWords": "D3, React"
        },
        {
            "id": 2,
            "title": "How Node.js Microservices Interact with Each Other Using gRPC",
            "publishDate": "2021-02-06T12:00:00Z",
            "text": "In this article, we will learn how microservices interact with each other using the gRPC framework. gRPC is a modern RPC that enables microservices to interact with each other.",
            "url": "https://medium.com/p/34ccd2f86134",
            "keyWords": "gRPC, Microservices"
        },
        {
            "id": 3,
            "title": "Getting Started With NFT Art",
            "publishDate": "2021-03-07T12:00:00Z",
            "text": "In nowadays artists have a lot of alternatives. They can use the traditional canvas, but on the other hand, they can use PCs and various software such as Photoshop, 3dMax, etc.",
            "url": "https://medium.com/p/1f6790d1b08d",
            "keyWords": "NFT"
        },
        {
            "id": 4,
            "title": "Getting started with SOLID Principles",
            "publishDate": "2021-10-16T12:00:00Z",
            "text": "Today's software applications are extremely complex. In many cases, a team of developers develops the application. Naturally, certain problems may arise...",
            "url": "https://medium.com/p/90d48cbe694",
            "keyWords": "SOLID"
        }
    ]`);
}