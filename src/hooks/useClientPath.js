// hooks/useClientPath.js
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useClientPath() {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? pathname : '';
}