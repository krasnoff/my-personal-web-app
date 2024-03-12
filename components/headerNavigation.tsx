'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"; 

export default function HeaderNavigation() {
    const pathName = usePathname();
    
    return (
        <>
            <div className="mx-auto max-w-outerFrame h-20 flex items-center justify-end font-medium">
                <Link className={pathName === '/works' ? 'mr-8 cursor-pointer text-red-500' : 'mr-8 cursor-pointer'} href="/works">Works</Link>
                <Link className={pathName === '/posts' ? 'mr-8 cursor-pointer text-red-500' : 'mr-8 cursor-pointer'} href="/posts">Posts</Link>
                <Link className={pathName === '/contact' ? 'mr-8 cursor-pointer text-red-500' : 'mr-8 cursor-pointer'} href="/contact">Contact</Link>
            </div>
        </>
    );
}