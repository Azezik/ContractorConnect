import { useEffect, useState } from 'react';
import { subscribeToUnreadMessageCount } from '../services/messageService';

export function useConversationUnreadCount(conversationId, userId) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!conversationId || !userId) {
      setUnreadCount(0);
      return undefined;
    }

    return subscribeToUnreadMessageCount(conversationId, userId, setUnreadCount);
  }, [conversationId, userId]);

  return unreadCount;
}
