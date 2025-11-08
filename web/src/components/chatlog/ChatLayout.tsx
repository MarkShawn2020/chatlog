'use client';

import { useAtom } from 'jotai';
import { NavigationSidebar } from './NavigationSidebar';
import { ConversationListPanel } from './ConversationListPanel';
import { ChatPanel } from './ChatPanel';
import { selectedConversationAtom } from '@/stores/chatlogStore';

export function ChatLayout() {
  const [selectedConversation] = useAtom(selectedConversationAtom);

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-2 sm:p-4 lg:p-8">
      <div className="w-full max-w-[1600px] h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)] flex overflow-hidden bg-background rounded-lg sm:rounded-2xl shadow-xl border border-border">
        {/* Left: Navigation Sidebar - hidden on mobile when chat is open */}
        <div className={selectedConversation ? 'hidden lg:flex' : 'flex'}>
          <NavigationSidebar />
        </div>

        {/* Middle: Conversation List - hidden on mobile when chat is open */}
        <div className={selectedConversation ? 'hidden md:flex' : 'flex flex-1'}>
          <ConversationListPanel />
        </div>

        {/* Right: Chat Panel - hidden on mobile when no chat selected */}
        <div className={selectedConversation ? 'flex flex-1' : 'hidden md:flex md:flex-1'}>
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
