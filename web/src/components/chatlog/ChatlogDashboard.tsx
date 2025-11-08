'use client';

import { useAtom } from 'jotai';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { SessionList } from './SessionList';
import { ChatRoomList } from './ChatRoomList';
import { ContactList } from './ContactList';
import { ChatlogViewer } from './ChatlogViewer';
import { activeTabAtom } from '@/stores/chatlogStore';
import { MessageCircle, Users, UserCircle, MessageSquare } from 'lucide-react';

export function ChatlogDashboard() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  return (
    <div className="min-h-screen bg-background">
      <div className="u-container py-16 lg:py-24">
        {/* Hero Section - Lovpen Style */}
        <div className="u-mb-gutter text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium shadow-sm transition hover:opacity-90">
            <MessageCircle className="w-4 h-4" />
            <span>服务运行中</span>
          </div>

          <h1 className="u-display-xl">
            欢迎使用 Lovchat
          </h1>

          <p className="u-paragraph-l max-w-2xl mx-auto text-muted-foreground">
            你的专属聊天助手，让珍贵的对话永不丢失
          </p>
        </div>

        {/* Main Content Card - Lovpen Style */}
        <Card className="rounded-2xl shadow-md border-0 bg-card overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
            {/* Tab Navigation with Lovpen Colors */}
            <div className="border-b border-border bg-secondary/50">
              <TabsList className="w-full h-auto bg-transparent grid grid-cols-2 lg:grid-cols-4 gap-2 p-4">
                <TabsTrigger
                  value="session"
                  className="flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-md transition data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">最近会话</span>
                  <span className="sm:hidden">会话</span>
                </TabsTrigger>

                <TabsTrigger
                  value="chatroom"
                  className="flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-md transition data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">群聊</span>
                  <span className="sm:hidden">群聊</span>
                </TabsTrigger>

                <TabsTrigger
                  value="contact"
                  className="flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-md transition data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">联系人</span>
                  <span className="sm:hidden">联系人</span>
                </TabsTrigger>

                <TabsTrigger
                  value="chatlog"
                  className="flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-md transition data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">聊天记录</span>
                  <span className="sm:hidden">记录</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content with Lovpen Spacing */}
            <div className="p-6 lg:p-8">
              <TabsContent value="session" className="mt-0">
                <SessionList />
              </TabsContent>

              <TabsContent value="chatroom" className="mt-0">
                <ChatRoomList />
              </TabsContent>

              <TabsContent value="contact" className="mt-0">
                <ContactList />
              </TabsContent>

              <TabsContent value="chatlog" className="mt-0">
                <ChatlogViewer />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Footer - Lovpen Style */}
        <div className="u-mt-gutter text-center">
          <p className="text-sm text-muted-foreground">
            Lovchat 已为您准备就绪 • 所有数据仅存储在本地
          </p>
        </div>
      </div>
    </div>
  );
}
