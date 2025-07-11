import AllConversation from "./ui/allConversations"

const ConversationPage = () => {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-2xl bg-surface rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">
          Suas Conversas
        </h1>

        <div className="space-y-4">
          <AllConversation  />
        </div>
      </div>
    </div>
  )
}

export default ConversationPage
