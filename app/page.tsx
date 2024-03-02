

export default function Home() {
  return (
      <div className="mx-auto max-w-innerFrame flex items-stretch mt-32 flex-col">
        <div className="flex flex-row">
          <div className="flex-1 flex flex-col">
            <h1 className="font-bold text-5xl leading-tight">
              Hi, I am Kobi,<br></br>
              Front End developer
            </h1>
            <div className="flex-1 flex items-end pr-20">
            Passionate and proficient developer adept in React, TypeScript, CSS, and Tailwind, crafting seamless digital experiences with creativity and precision.
            </div>
          </div>
          <div className="size-60 rounded-full bg-[url('/img/portrait.jpg')] bg-cover"></div>
        </div>
        <div className="mt-10">
          <button className="primary-button">Download Resume</button>
        </div>
      </div>
      
  );
}
