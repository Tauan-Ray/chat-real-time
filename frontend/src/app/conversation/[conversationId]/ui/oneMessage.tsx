import { cn } from "@/lib/utils"

type oneMessageProps = {
  id: string;
  content: string;
  date: string;
  deletedAt: string | null;
  owner: "me" | "other";
};

const OneMessage = ({ id, content, date, deletedAt, owner }: oneMessageProps) => {
  const formattedData = new Date(date).toLocaleTimeString("pt-BR", {
    hour: '2-digit',
    minute: '2-digit'
  })
  return (
    <div className={cn("flex", owner === "me" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "p-3 rounded-lg max-w-xs",
          owner === "me" ? "bg-primary text-white" : "bg-secondary text-text-primary"
        )}
      >
        {!deletedAt ? (
            <>
                <p className="text-sm">{content}</p>
                <span
                className={cn(
                    "text-xs block mt-1 text-right",
                    owner === "me" ? "text-white/80" : "text-text-secondary"
                )}
                >
                {formattedData}
                </span>
            </>
        ): <p>Mensagem Apagada</p>}
      </div>
    </div>
  );
};

export default OneMessage;
