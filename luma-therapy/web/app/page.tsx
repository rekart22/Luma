import ChatContainer from "@/components/components/chat/ChatContainer";
import Header from "@/components/components/layout/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-luma-text flex flex-col">
      <Header />
      <ChatContainer />
    </main>
  );
}
