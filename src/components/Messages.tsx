import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Shield, Star, MessageSquare, ArrowLeft, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../context/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserPhoto: string;
  updated_at: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface MessagesProps {
  onBack?: () => void;
  startConversationWith?: string; // userId to start conversation with
  onConversationStarted?: () => void; // Callback when conversation is created
}

export function Messages({ onBack, startConversationWith }: MessagesProps) {
  const { user, getConversations, getMessages, sendMessage, markMessagesAsRead, createConversation, subscribeToMessages } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      setLoading(true);
      const result = await getConversations();
      if (result.error) {
        console.error('Error loading conversations:', result.error);
      } else {
        // Get last message for each conversation
        const convsWithMessages = await Promise.all(
          (result.data || []).map(async (conv: any) => {
            const msgResult = await getMessages(conv.id);
            const msgs = msgResult.data || [];
            const lastMsg = msgs[msgs.length - 1];
            const unreadCount = msgs.filter((m: Message) => !m.is_read && m.sender_id !== user.id).length;

            return {
              ...conv,
              lastMessage: lastMsg?.content || '',
              lastMessageTime: lastMsg ? formatTime(lastMsg.created_at) : '',
              unreadCount,
            };
          })
        );
        setConversations(convsWithMessages);
      }
      setLoading(false);
    };

    loadConversations();
  }, [user, getConversations, getMessages]);

  // Handle starting conversation with specific user
  useEffect(() => {
    const startConv = async () => {
      if (!startConversationWith || !user) return;
      
      const result = await createConversation(startConversationWith);
      if (result.data) {
        setSelectedConversation(result.data.id);
        // Reload conversations
        const convsResult = await getConversations();
        if (convsResult.data) {
          const convsWithMessages = await Promise.all(
            convsResult.data.map(async (conv: any) => {
              const msgResult = await getMessages(conv.id);
              const msgs = msgResult.data || [];
              const lastMsg = msgs[msgs.length - 1];
              const unreadCount = msgs.filter((m: Message) => !m.is_read && m.sender_id !== user.id).length;
              return {
                ...conv,
                lastMessage: lastMsg?.content || '',
                lastMessageTime: lastMsg ? formatTime(lastMsg.created_at) : '',
                unreadCount,
              };
            })
          );
          setConversations(convsWithMessages);
        }
      }
    };

    startConv();
  }, [startConversationWith, user, createConversation, getConversations, getMessages]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const result = await getMessages(selectedConversation);
      if (result.error) {
        console.error('Error loading messages:', result.error);
      } else {
        setMessages(result.data || []);
        // Mark messages as read
        await markMessagesAsRead(selectedConversation);
        // Update unread count in conversations list
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation ? { ...conv, unreadCount: 0 } : conv
        ));
      }
    };

    loadMessages();

    // Subscribe to real-time updates
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const unsubscribe = subscribeToMessages(selectedConversation, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      // Mark as read if it's not from current user
      if (newMessage.sender_id !== user?.id) {
        markMessagesAsRead(selectedConversation);
      }
      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { 
              ...conv, 
              lastMessage: newMessage.content,
              lastMessageTime: formatTime(newMessage.created_at),
              unreadCount: newMessage.sender_id === user?.id ? 0 : conv.unreadCount + 1
            }
          : conv
      ));
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [selectedConversation, getMessages, markMessagesAsRead, subscribeToMessages, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !user) return;
    
    setSending(true);
    const result = await sendMessage(selectedConversation, messageInput);
    if (result && 'error' in result) {
      console.error('Error sending message:', result.error);
    } else {
      setMessageInput('');
    }
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 pl-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}
      
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-medium mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start browsing profiles to find compatible flatmates and begin conversations.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>💬 Send your first message</p>
                    <p>🔒 Keep conversations secure</p>
                    <p>🤝 Build connections safely</p>
                  </div>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.otherUserPhoto || undefined} alt={conversation.otherUserName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                            {getInitials(conversation.otherUserName)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 
                              className="font-medium truncate cursor-pointer hover:text-primary transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                const event = new CustomEvent('open-public-profile', { detail: { userId: conversation.otherUserId } });
                                window.dispatchEvent(event);
                              }}
                            >
                              {conversation.otherUserName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1">
                            {conversation.lastMessageTime && (
                              <span className="text-xs text-muted-foreground">
                                {conversation.lastMessageTime}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 text-xs rounded-full p-0 flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {conversation.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConv.otherUserPhoto || undefined} alt={selectedConv.otherUserName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {getInitials(selectedConv.otherUserName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 
                        className="font-medium cursor-pointer hover:text-primary transition-colors"
                        onClick={() => {
                          const event = new CustomEvent('open-public-profile', { detail: { userId: selectedConv.otherUserId } });
                          window.dispatchEvent(event);
                        }}
                      >
                        {selectedConv.otherUserName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const event = new CustomEvent('open-public-profile', { detail: { userId: selectedConv.otherUserId } });
                        window.dispatchEvent(event);
                      }}
                      title="View Profile"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground ml-4'
                              : 'bg-muted mr-4'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button onClick={handleSendMessage} disabled={!messageInput.trim() || sending}>
                    {sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Tip: Keep your initial conversations on the platform for safety
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground max-w-md">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="font-medium mb-3">Ready to start conversations?</h3>
                <p className="text-sm mb-4">
                  Browse profiles to find compatible flatmates and send your first message. All conversations are secure and monitored for safety.
                </p>
                <div className="text-xs space-y-1">
                  <p>🔍 Browse verified profiles</p>
                  <p>💬 Send secure messages</p>
                  <p>🤝 Connect with confidence</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}