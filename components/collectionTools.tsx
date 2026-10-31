'use client';

import { useEffect } from 'react';
import { CollectionItem, createCollectionTools } from '@/lib/collection-tools';
import { registerWebMCPTool } from '@/lib/webmcp';

export default function CollectionTools({ collection, items }: {
    collection: 'posts' | 'works';
    items: CollectionItem[];
}) {
    useEffect(() => {
        const cleanup = createCollectionTools(collection, items).map(registerWebMCPTool);
        return () => cleanup.forEach(unregister => unregister());
    }, [collection, items]);
    return null;
}
