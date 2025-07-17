"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import AllConversations from "./allConversations"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import CreateNewConversation from "./CreateNewConversation"

const SearchConversation = () => {
    const [query, setQuery] = useState<string>("")
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="fixed bottom-6 right-6 md:right-[calc(50%-336px+1rem)] z-50 w-14 h-14 rounded-full p-0 bg-primary text-white hover:bg-primary/90 shadow-xl">
                    <Plus className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="text-text-primary">
                        Buscar por conversas
                    </SheetTitle>
                    <SheetDescription className="text-text-primary">
                        Busque por conversas por nome de usuário ou email
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full mt-6 gap-4">
                    <Input
                        type="text"
                        placeholder="Buscar usuário pelo nome"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Email do usuário"
                    />

                    <CreateNewConversation />

                    <div className="flex-1 overflow-y-auto pb-14 scrollbar-hide rounded-md">
                        <AllConversations query={query}/>
                    </div>

                </div>
            </SheetContent>
        </Sheet>

    )
}

export default SearchConversation