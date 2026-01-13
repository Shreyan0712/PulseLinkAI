import React, { createContext, useContext, useState } from 'react';
import chatHistoryData from '@/mocks/chatHistory.json';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  fileAttachment?: {
    name: string;
    type: string;
    url: string;
  };
}

interface Thread {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

interface ChatContextType {
  threads: Thread[];
  currentThread: Thread | null;
  setCurrentThread: (thread: Thread | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  createNewThread: () => void;
  guestMessages: Message[];
  addGuestMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearGuestMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threads, setThreads] = useState<Thread[]>(chatHistoryData as Thread[]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [guestMessages, setGuestMessages] = useState<Message[]>([]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    if (currentThread) {
      const updatedThread = {
        ...currentThread,
        messages: [...currentThread.messages, newMessage],
      };
      setCurrentThread(updatedThread);
      setThreads(threads.map(t => t.id === currentThread.id ? updatedThread : t));
    }

    // Mock AI response
    if (message.role === 'user') {
      setTimeout(() => {
        const aiMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: "I understand your concern. I'm here to help you with your health queries. Based on what you've shared, I'd recommend consulting with a healthcare professional for a proper diagnosis. Would you like me to help you find a doctor or book an appointment?",
          timestamp: new Date().toISOString(),
        };
        
        if (currentThread) {
          const updatedThread = {
            ...currentThread,
            messages: [...currentThread.messages, newMessage, aiMessage],
          };
          setCurrentThread(updatedThread);
          setThreads(threads.map(t => t.id === currentThread.id ? updatedThread : t));
        }
      }, 1000);
    }
  };

  const addGuestMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `guest-msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setGuestMessages(prev => [...prev, newMessage]);

    // Mock AI response for guest
    if (message.role === 'user') {
      setTimeout(() => {
        const aiMessage: Message = {
          id: `guest-msg-${Date.now()}`,
          role: 'assistant',
          content: "Thank you for reaching out! I can help you with general health information. For personalized care and to book appointments, I'd recommend creating an account. In the meantime, how can I assist you today?",
          timestamp: new Date().toISOString(),
        };
        setGuestMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const clearGuestMessages = () => {
    setGuestMessages([]);
  };

  const createNewThread = () => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title: 'New conversation',
      date: new Date().toISOString().split('T')[0],
      messages: [],
    };
    setThreads([newThread, ...threads]);
    setCurrentThread(newThread);
  };

  return (
    <ChatContext.Provider
      value={{
        threads,
        currentThread,
        setCurrentThread,
        addMessage,
        createNewThread,
        guestMessages,
        addGuestMessage,
        clearGuestMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
