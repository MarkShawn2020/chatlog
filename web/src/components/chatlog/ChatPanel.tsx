'use client';

import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, MessageSquare, Download, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { selectedConversationAtom, conversationMessagesAtom, exportDialogOpenAtom } from '@/stores/chatlogStore';
import { chatlogAPI, type Message } from '@/libs/ChatlogAPI';
import { format } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import { ExportDialog } from './ExportDialog';

export function ChatPanel() {
  const [selectedConversation, setSelectedConversation] = useAtom(selectedConversationAtom);
  const [messages, setMessages] = useAtom(conversationMessagesAtom);
  const [exportDialogOpen, setExportDialogOpen] = useAtom(exportDialogOpenAtom);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🎯 [ChatPanel] selectedConversation changed:', selectedConversation);
  }, [selectedConversation]);

  // Auto scroll to bottom when messages load/change (no animation)
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      // Double requestAnimationFrame to ensure DOM has been fully rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            console.log('📜 Scrolled to:', messagesContainerRef.current.scrollTop, 'of', messagesContainerRef.current.scrollHeight);
          }
        });
      });
    }
  }, [messages]);

  // Fetch messages when conversation is selected
  const { data, isLoading, error } = useQuery({
    queryKey: ['chatlog', selectedConversation?.id],
    queryFn: () => chatlogAPI.getChatlog({
      talker: selectedConversation!.id,
      time: 'last-30d',
      limit: 500,
      format: 'json',
    }),
    enabled: !!selectedConversation,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data, setMessages]);

  const formatTime = (timeStr: string) => {
    try {
      return format(new Date(timeStr), 'yyyy-MM-dd HH:mm:ss');
    }
    catch {
      return timeStr;
    }
  };

  const getImageUrl = (message: Message): string | null => {
    if (message.type !== 3 || !message.contents) {
      return null;
    }

    if (message.contents.md5) {
      return chatlogAPI.getImageURL(message.contents.md5);
    }

    if (message.contents.imgfile) {
      return chatlogAPI.getMediaDataURL(message.contents.imgfile);
    }

    return null;
  };

  // Empty state
  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">选择一个会话开始聊天</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Back button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {selectedConversation.displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="font-semibold truncate">{selectedConversation.displayName}</h2>
            <p className="text-xs text-muted-foreground truncate">{selectedConversation.id}</p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportDialogOpen(true)}
            className="flex-shrink-0"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">导出 ({messages.length})</span>
            <span className="sm:hidden">{messages.length}</span>
          </Button>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        {error ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20 text-destructive" />
              <p className="text-destructive mb-1">加载失败</p>
              <p className="text-xs">{error instanceof Error ? error.message : '未知错误'}</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">加载消息中...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>暂无聊天记录</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto p-4 md:p-6 min-w-0 w-full">
            {messages.map((message, index) => {
              const isSystemMsg = message.type === 10000;
              const isImageMsg = message.type === 3;
              const isReferMsg = message.type === 49 && message.subType === 57;

              if (isSystemMsg) {
                return (
                  <div key={index} className="flex justify-center py-1">
                    <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded">
                      系统消息
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`flex gap-3 w-full ${message.isSelf ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={message.senderAvatar}
                        alt={message.senderName || message.sender || '用户'}
                      />
                      <AvatarFallback className={message.isSelf ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                        {message.isSelf
                          ? '我'
                          : (message.senderName || message.sender || '?').slice(0, 2).toUpperCase()
                        }
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Message bubble */}
                  <div className={`flex flex-col max-w-[70%] sm:max-w-[60%] min-w-0 ${message.isSelf ? 'items-end' : 'items-start'}`}>
                    {/* Sender name and time */}
                    <div className={`flex gap-2 items-center mb-1 px-1 max-w-full ${message.isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-xs text-muted-foreground font-medium truncate">
                        {message.isSelf ? '我' : (message.senderName || message.sender || message.talker)}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {formatTime(message.time)}
                      </span>
                    </div>

                    {/* Message content */}
                    <div
                      className={`rounded-lg max-w-full ${
                        isImageMsg ? 'p-1' : 'px-4 py-2'
                      } ${
                        message.isSelf
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {isImageMsg && (() => {
                        const imageUrl = getImageUrl(message);
                        return imageUrl ? (
                          <div className="relative group">
                            <img
                              src={imageUrl}
                              alt="聊天图片"
                              className="max-w-[240px] max-h-[320px] rounded cursor-pointer object-cover"
                              onClick={() => setPreviewImage(imageUrl)}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden flex items-center gap-2 text-sm p-2">
                              <ImageIcon className="h-4 w-4" />
                              <span>[图片加载失败]</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm p-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>[图片消息]</span>
                          </div>
                        );
                      })()}

                      {isReferMsg && (
                        <div className="mb-2 p-2 rounded bg-black/10 border-l-2 border-current text-xs opacity-75">
                          引用消息
                        </div>
                      )}

                      {!isImageMsg && (
                        <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
                          {message.displayContent || message.content || '[无内容]'}
                        </div>
                      )}

                      {message.type !== 1 && message.type !== 3 && message.type !== 49 && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          类型 {message.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Export Dialog */}
      {messages.length > 0 && (
        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          messages={messages}
        />
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-2">
          {previewImage && (
            <div className="flex items-center justify-center">
              <img
                src={previewImage}
                alt="预览"
                className="max-w-full max-h-[85vh] object-contain rounded"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
