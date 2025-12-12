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
            "id": "9",
            "publishYear": "2025",
            "keywords": "React, Vite, Stroybook, NPM Repository",
            "title": "NPM creation template",
            "url": "https://github.com/krasnoff/react-vite-npm-template",
            "gitUrl": "https://github.com/krasnoff/react-vite-npm-template",
            "description": "A simple template to create a React component and publish it to NPM repository using Vite and Storybook.",
            "image": "npm-template.png"
        },
        {
            "id": "8",
            "publishYear": "2025",
            "keywords": "React, Next.js, Node.js, SDK AI, Gemini AI",
            "title": "Crime Rate Analysis",
            "url": "https://crime-rate-analysis.vercel.app",
            "gitUrl": "https://github.com/krasnoff/crime-rate-analysis",
            "description": "Using AI to analyse crime data from israel",
            "image": "crime-rate-analysis.png"
        },
        {
            "id": "7",
            "publishYear": "2025",
            "keywords": "React Native",
            "title": "News Viewer",
            "url": "https://expo.dev/accounts/krasnoff/projects/emptyProject2/builds/d0712234-0ad2-4499-9740-64067028a49d",
            "gitUrl": "https://github.com/krasnoff/NewsViewer",
            "description": "My latest Android App. It displays News creation from NewsAPI.org.",
            "image": "news-viewer.png"
        },
        {
            "id": "6",
            "publishYear": "2024",
            "keywords": "React Native",
            "title": "Manga Viewer",
            "url": "https://play.google.com/store/apps/details?id=com.krasnoffkobi.mangaviewer",
            "gitUrl": "https://github.com/krasnoff/MangaViewer",
            "description": "My latest Android App. It displays manga creation from MangaDex API.",
            "image": "manga_viewer.webp"
        },
        {
            "id": "5",
            "publishYear": "2024",
            "keywords": "React, NextJS, Tailwind, NodeJS",
            "title": "My Personal Web Site",
            "url": "https://krasnoff-personal-web-app.vercel.app/",
            "gitUrl": "https://github.com/krasnoff/my-personal-web-app",
            "description": "My own personal web site. It displays a list of my personal projects. This site was built using ReactJS and Tailwind. This site design is based on this design system: https://www.figma.com/design/tz70DnGvpidvpJMcCPUgRt/Portfolio-UI---Web-%26-Mobile-(Community)?node-id=0-1",
            "image": "about-me.png"
        },
        {
            "id": "7",
            "publishYear": "2025",
            "keywords": "React, Vite, NPM, Accessibility",
            "title": "React Accessibility Component",
            "url": "https://www.npmjs.com/package/react-accessibility-component",
            "gitUrl": "https://github.com/krasnoff/vite-react-ts-component",
            "description": "AccessibilityComponent is a React component designed to enhance web accessibility by providing essential features that support users with disabilities. It is intended to be used as part of a broader strategy for making web applications accessible.",
            "image": "react-accessibility.png"
        },
        {
            "id": "1",
            "publishYear": "2023",
            "keywords": "React, Dashbord",
            "title": "React admin screen",
            "url": "https://react-bootstrap-admin-app.surge.sh/",
            "gitUrl": "https://github.com/krasnoff/bootstrap-admin-app?tab=readme-ov-file",
            "description": "This is an admin template which demonstrate a React app using hooks, bootstrap design system and much more...",
            "image": "1_TSeWgZynzkbsF783uNeO3Q.webp"
        },
        {
            "id": "2",
            "publishYear": "2023",
            "keywords": "React, Component, Video",
            "title": "Video frame by frame React component",
            "url": "https://www.npmjs.com/package/videoframebyframe",
            "gitUrl": "https://github.com/krasnoff/video-frame-by-frame",
            "description": "This component displays a particular version of an HTML Video element which enables the display of video with the ability to advance or reverse the movie frame by frame.",
            "image": "1_TSeWgZynzkbsF783uNeO3Q.webp"
        },
        {
            "id": "3",
            "publishYear": "2023",
            "keywords": "React, File, Upload",
            "title": "File upload component",
            "url": "https://www.npmjs.com/package/uploadfilereducedsize",
            "gitUrl": "https://github.com/krasnoff/upload-reduced-size-file",
            "description": "This is a React upload component that also reduces the image file size if necessary.",
            "image": "file-upload.png"
        },
        {
            "id": "4",
            "publishYear": "2023",
            "keywords": "React, Calendar",
            "title": "React hebrew calendar",
            "url": "https://www.npmjs.com/package/@krasnoff/react-vite-heb-calendar",
            "gitUrl": "https://github.com/krasnoff/react-vite-npm-heb-calendar",
            "description": "This component is a simple calendar which displays the gergorian calendar and the hebrew calendar.",
            "image": "react-hebrew-calendar.png"
        }
    ]`); 
}

const getPosts = () => {
    return JSON.parse(`[
        {
            "id": 1,
            "title": "From Natural Language to Generative UI: How I Built PassengerAssistant Using React Native + AI + Server Logic",
            "publishDate": "2025-12-25T07:00:00Z",
            "text": "From Natural Language to Generative UI: How I Built PassengerAssistant Using React Native + AI + Server Logic In this article, I will share my experience of building PassengerAssistant, a mobile application that generates user interfaces based on natural language input. The app leverages React Native for cross-platform development, AI for natural language processing, and server-side logic to handle requests and generate UI components.",
            "url": "https://medium.com/p/976e9a6754b4",
            "keyWords": "AI, React Native, Generative UI"
        },
        {
            "id": 2,
            "title": "How to turn your PC into a webcam?",
            "publishDate": "2024-10-25T12:00:00Z",
            "text": "In this article, we will build a simple web page, connect it to a webcam, display what the webcam shoots, and finally transmit the video stream to another web browser on another computer to display the video stream.",
            "url": "https://medium.com/@krasnoff-kobi/how-to-turn-your-pc-into-a-webcam-8ba8e525cfe6",
            "keyWords": "WebRTC, WebSocket"
        },
        {
            "id": 3,
            "title": "Integrating D3.js to a Typescript React Application",
            "publishDate": "2021-05-02T12:00:00Z",
            "text": "In today's front-end application development, the ReactJS library has become the most popular Javascript/Typescript framework. On the other hand, D3.js is the most commonly used Javascript library for creating dynamic charts on the Web. Integrating the two frameworks and more than that using the Typescript language can be a bit tricky. But it is absolutely possible. That is the purpose of this article.",
            "url": "https://medium.com/p/d77580756b20",
            "keyWords": "D3, React"
        },
        {
            "id": 4,
            "title": "How Node.js Microservices Interact with Each Other Using gRPC",
            "publishDate": "2021-02-06T12:00:00Z",
            "text": "In this article, we will learn how microservices interact with each other using the gRPC framework. gRPC is a modern RPC that enables microservices to interact with each other.",
            "url": "https://medium.com/p/34ccd2f86134",
            "keyWords": "gRPC, Microservices"
        },
        {
            "id": 5,
            "title": "Getting Started With NFT Art",
            "publishDate": "2021-03-07T12:00:00Z",
            "text": "In nowadays artists have a lot of alternatives. They can use the traditional canvas, but on the other hand, they can use PCs and various software such as Photoshop, 3dMax, etc.",
            "url": "https://medium.com/p/1f6790d1b08d",
            "keyWords": "NFT"
        },
        {
            "id": 6,
            "title": "Getting started with SOLID Principles",
            "publishDate": "2021-10-16T12:00:00Z",
            "text": "Today's software applications are extremely complex. In many cases, a team of developers develops the application. Naturally, certain problems may arise...",
            "url": "https://medium.com/p/90d48cbe694",
            "keyWords": "SOLID"
        }
    ]`);
}