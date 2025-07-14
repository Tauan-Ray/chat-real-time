import { UserProvider } from "@/contexts/user-context"


export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="min-h-screen flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-hidden overflow-x-hidden">
          <main id="scroll-area" className="flex-1 relative p-4 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  )
}