import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Plus } from "lucide-react"
import SearchUser from "./searchUsers"

const CreateNewConversation = () => {
    return (
        <Dialog>
            <DialogTrigger asChild >
                <Button variant="secondary" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar novo contato
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-text-primary">Criar nova conversa</DialogTitle>
                    <DialogDescription className="text-text-primary">
                        Digite o email de um usuário e se conecte com ele agora!
                    </DialogDescription>
                </DialogHeader>
                <SearchUser />
            </DialogContent>
        </Dialog>
    )
}

export default CreateNewConversation