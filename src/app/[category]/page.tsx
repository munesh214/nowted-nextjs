"use client"
import { usePathname } from "next/navigation";
import NoNoteSelected from "@/components/rightPanel/NoNoteSelected";


export default function FolderIdPage() {
    const pathname = usePathname();
    const isNoteSelected = pathname.split('/').length > 2;
    return (
        <>
            {isNoteSelected ? <p>Something</p> : <NoNoteSelected />}
        </>
    )
}