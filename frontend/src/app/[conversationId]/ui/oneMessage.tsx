import { cn } from "@/lib/utils"
import { CheckCheck } from "lucide-react";

type oneMessageProps = {
  id: string;
  content: string;
  date: string;
  deletedAt: string | null;
  owner: "me" | "other";
  readBy: string[];
};

const OneMessage = ({ id, content, date, deletedAt, owner, readBy }: oneMessageProps) => {
  const formattedData = new Date(date).toLocaleTimeString("pt-BR", {
    hour: '2-digit',
    minute: '2-digit'
  })

  const isReadByOthers = owner === "me" && readBy.length > 0;

  return (
    <div className={cn("flex", owner === "me" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "p-3 rounded-lg max-w-xs flex gap-2",
          owner === "me" ? "bg-primary text-white" : "bg-secondary text-text-primary"
        )}
      >
        {!deletedAt ? (
            <>
                <p className="text-sm">{content}</p>
                <span
                className={cn(
                    "text-xs mt-4 text-right flex gap-2",
                    owner === "me" ? "text-white/80" : "text-text-secondary"
                )}
                >
                  {formattedData}
                  {owner === "me" && (
                    isReadByOthers ? <CheckCheck className="w-4 h-4 text-blue-500" /> : <CheckCheck className="w-4 h-4" />
                  )}
                </span>
            </>
        ): <p>Mensagem Apagada</p>}

      </div>
    </div>
  );
};

export default OneMessage;
