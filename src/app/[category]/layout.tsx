'use client';
import MiddlePanel from '@/components/middlePanel/MiddlePanel';
// import { usePathname } from 'next/navigation';

export default function FolderLayout({ children }: { children: React.ReactNode }) {
    // const pathname = usePathname();
    // const isNoteSelected = pathname.split('/').length > 2; // Checks if noteId exists

    return (
        <>
            <MiddlePanel />
            {children}
        </>
    );
}
