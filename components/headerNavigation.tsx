'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"; 

export default function HeaderNavigation() {
    const pathName = usePathname();
    
    return (
        <>
            <div className="mx-auto max-w-outerFrame h-20 flex items-center justify-end font-medium">
                {pathName ? 
                    <div>
                        <Link className={pathName.indexOf('/works') > -1 ? 'mr-8 cursor-pointer text-red-500' : 'mr-8 cursor-pointer'} href="/works">Works</Link>
                        <Link className={pathName.indexOf('/posts') > -1 ? 'mr-8 cursor-pointer text-red-500' : 'mr-8 cursor-pointer'} href="/posts">Posts</Link>
                        <Link className={pathName.indexOf('/contact') > -1 ? 'mr-8 cursor-pointer text-red-500' : 'mr-8 cursor-pointer'} href="/contact">Contact</Link>
                    </div>
                : null}
            </div>
        </>
    );
}