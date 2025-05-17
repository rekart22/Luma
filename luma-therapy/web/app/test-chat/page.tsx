import ChatContainer from "@/components/components/chat/ChatContainer";

export default function TestChatPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Chat (Unprotected)</h1>
      <div className="mb-4 p-4 bg-yellow-100 rounded-md">
        <p>This is an unprotected test chat page for debugging purposes.</p>
      </div>
      <ChatContainer />
    </div>
  );
} 