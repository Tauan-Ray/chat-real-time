import { ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"

const HeaderChat = ({ participantName }: { participantName: string }) => {
  return (
    <header className="flex items-center gap-3 bg-surface p-4 border-b border-border">
      <button
        onClick={() => redirect('/conversation')}
        className="p-2 rounded-md hover:bg-hover transition"
      >
        <ArrowLeft className="text-text-primary" size={20} />
      </button>
      <h1 className="text-lg font-semibold text-text-primary">{participantName}</h1>
    </header>
  )
}

export default HeaderChat
