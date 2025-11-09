'use client';

import { useAtom } from 'jotai';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { activeSectionAtom, selectedConversationAtom, type SelectedConversation } from '@/stores/chatlogStore';
import { chatlogAPI } from '@/libs/ChatlogAPI';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export function ConversationListPanel() {
  const [activeSection] = useAtom(activeSectionAtom);
  const [selectedConversation, setSelectedConversation] = useAtom(selectedConversationAtom);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Fetch sessions with infinite scroll
  const {
    data: sessionsData,
    fetchNextPage: fetchNextSessionsPage,
    hasNextPage: hasNextSessionsPage,
    isFetchingNextPage: isFetchingNextSessionsPage,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useInfiniteQuery({
    queryKey: ['sessions'],
    queryFn: ({ pageParam = 0 }) =>
      chatlogAPI.getSessions({ format: 'json', limit: 50, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => sum + page.items.length, 0);
      return loadedCount < lastPage.total ? loadedCount : undefined;
    },
    enabled: activeSection === 'chats',
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    initialPageParam: 0,
  });

  // Fetch contacts with infinite scroll
  const {
    data: contactsData,
    fetchNextPage: fetchNextContactsPage,
    hasNextPage: hasNextContactsPage,
    isFetchingNextPage: isFetchingNextContactsPage,
    isLoading: isLoadingContacts,
    error: contactsError,
  } = useInfiniteQuery({
    queryKey: ['contacts'],
    queryFn: ({ pageParam = 0 }) =>
      chatlogAPI.getContacts({ format: 'json', limit: 20, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => sum + page.items.length, 0);
      return loadedCount < lastPage.total ? loadedCount : undefined;
    },
    enabled: activeSection === 'contacts',
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    initialPageParam: 0,
  });

  // Fetch chatrooms with infinite scroll
  const {
    data: chatroomsData,
    fetchNextPage: fetchNextChatroomsPage,
    hasNextPage: hasNextChatroomsPage,
    isFetchingNextPage: isFetchingNextChatroomsPage,
    isLoading: isLoadingChatrooms,
    error: chatroomsError,
  } = useInfiniteQuery({
    queryKey: ['chatrooms'],
    queryFn: ({ pageParam = 0 }) =>
      chatlogAPI.getChatRooms({ format: 'json', limit: 20, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => sum + page.items.length, 0);
      return loadedCount < lastPage.total ? loadedCount : undefined;
    },
    enabled: activeSection === 'groups',
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    initialPageParam: 0,
  });

  const isLoading = isLoadingSessions || isLoadingContacts || isLoadingChatrooms;
  const error = sessionsError || contactsError || chatroomsError;

  // Flatten infinite query pages
  const sessions = sessionsData?.pages.flatMap(page => page.items) ?? [];
  const contacts = contactsData?.pages.flatMap(page => page.items) ?? [];
  const chatrooms = chatroomsData?.pages.flatMap(page => page.items) ?? [];

  // Infinite scroll observer using useInView hook
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView) {
      if (activeSection === 'chats' && hasNextSessionsPage && !isFetchingNextSessionsPage) {
        fetchNextSessionsPage();
      } else if (activeSection === 'contacts' && hasNextContactsPage && !isFetchingNextContactsPage) {
        fetchNextContactsPage();
      } else if (activeSection === 'groups' && hasNextChatroomsPage && !isFetchingNextChatroomsPage) {
        fetchNextChatroomsPage();
      }
    }
  }, [inView, activeSection, hasNextSessionsPage, hasNextContactsPage, hasNextChatroomsPage, isFetchingNextSessionsPage, isFetchingNextContactsPage, isFetchingNextChatroomsPage, fetchNextSessionsPage, fetchNextContactsPage, fetchNextChatroomsPage]);

  // Filter and map data based on active section
  const items = (() => {
    const keyword = searchKeyword.toLowerCase();

    if (activeSection === 'chats' && sessions.length > 0) {
      return sessions
        .filter(s =>
          !keyword ||
          s.userName.toLowerCase().includes(keyword) ||
          s.nickName?.toLowerCase().includes(keyword) ||
          s.content?.toLowerCase().includes(keyword)
        )
        .map(session => ({
          type: 'session' as const,
          id: session.userName,
          displayName: session.nickName || session.userName,
          avatar: session.avatarUrl,
          subtitle: session.content,
          time: dayjs(session.nTime).fromNow(),
          unreadCount: session.nUnReadCount,
        }));
    }

    if (activeSection === 'contacts' && contacts.length > 0) {
      return contacts
        .filter(c =>
          !keyword ||
          c.userName.toLowerCase().includes(keyword) ||
          c.nickName?.toLowerCase().includes(keyword) ||
          c.remark?.toLowerCase().includes(keyword)
        )
        .map(contact => ({
          type: 'contact' as const,
          id: contact.userName,
          displayName: contact.remark || contact.nickName || contact.userName,
          avatar: contact.smallHeadImgUrl || contact.bigHeadImgUrl,
          subtitle: contact.userName,
        }));
    }

    if (activeSection === 'groups' && chatrooms.length > 0) {
      return chatrooms
        .filter(g =>
          !keyword ||
          g.name.toLowerCase().includes(keyword) ||
          g.nickName?.toLowerCase().includes(keyword)
        )
        .map(group => ({
          type: 'chatroom' as const,
          id: group.name,
          displayName: group.nickName || group.name,
          avatar: undefined,
          subtitle: `${group.users?.length || 0} 成员`,
        }));
    }

    return [];
  })();

  const handleSelectItem = (item: typeof items[0]) => {
    const conversation: SelectedConversation = {
      type: item.type,
      id: item.id,
      displayName: item.displayName,
      avatar: item.avatar,
    };
    console.log('🔍 [ConversationListPanel] Selecting conversation:', conversation);
    setSelectedConversation(conversation);
    console.log('✅ [ConversationListPanel] Conversation selected');
  };

  return (
    <div className="w-80 shrink-0 bg-background border-r border-border flex flex-col min-w-0">
      {/* Search bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-sm text-destructive text-center mb-2">加载失败</p>
            <p className="text-xs text-muted-foreground text-center">
              {error instanceof Error ? error.message : '未知错误'}
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">加载中...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              {searchKeyword ? '无搜索结果' : '暂无数据'}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {items.map((item) => {
                const isSelected = selectedConversation?.id === item.id && selectedConversation?.type === item.type;

                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelectItem(item)}
                    className={cn(
                      'w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors text-left',
                      isSelected && 'bg-accent'
                    )}
                  >
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={item.avatar} alt={item.displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {item.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {item.displayName}
                        </span>
                        {'time' in item && item.time && (
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {item.time}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {item.subtitle}
                        </p>
                        {'unreadCount' in item && item.unreadCount > 0 && (
                          <Badge variant="destructive" className="flex-shrink-0 h-5 min-w-5 px-1.5 text-xs">
                            {item.unreadCount > 99 ? '99+' : item.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Infinite scroll trigger and loading indicator */}
            {((activeSection === 'chats' && hasNextSessionsPage) ||
              (activeSection === 'contacts' && hasNextContactsPage) ||
              (activeSection === 'groups' && hasNextChatroomsPage)) && (
              <div ref={loadMoreRef} className="py-4 flex justify-center">
                {(isFetchingNextSessionsPage || isFetchingNextContactsPage || isFetchingNextChatroomsPage) ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <span className="text-xs text-muted-foreground">滚动加载更多...</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
