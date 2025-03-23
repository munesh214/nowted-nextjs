"use client"
import NoteEdit from "@/components/rightPanel/NoteEdit"
import Restore from "@/components/rightPanel/Restore"
import { useParams } from "next/navigation"

const NoteIdPage = () => {
  const {category} = useParams();
  return (
    <>
      {category == "trash" ? <Restore />: <NoteEdit />}
    </>
  )
}

export default NoteIdPage