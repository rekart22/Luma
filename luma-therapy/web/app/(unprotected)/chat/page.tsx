import ChatContainer from "@/components/components/chat/ChatContainer";
import { Button } from "@/components/components/ui/button";
import Link from "next/link";

export default function UnprotectedChatPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Luma Chat</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      <ChatContainer />
    </div>
  );
} 