'use client'

import Link from "next/link";

export default function HeaderNavigation() {
    return (
        <>
            <div className="mx-auto max-w-outerFrame h-20 flex items-center justify-end font-medium">
                <Link className="mr-8 cursor-pointer" href="/works">Works</Link>
                <Link className="mr-8 cursor-pointer" href="/posts">Posts</Link>
                <Link className="mr-8 cursor-pointer" href="/contact">Contact</Link>
            </div>
        </>
    );
}