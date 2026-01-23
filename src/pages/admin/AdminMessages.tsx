import { useState } from 'react';
import { Search, Mail, MailOpen, Eye, Trash2, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Aisha Mohammed',
    email: 'aisha.m@email.com',
    phone: '+971 50 999 8888',
    message: 'Hello! I would like to know if you have the Emerald Silk Thobe available in size XXL? Also, do you offer international shipping to the UK?',
    createdAt: '2024-01-23 14:30',
    isRead: false,
  },
  {
    id: '2',
    name: 'Khalid Rashid',
    email: 'khalid.r@email.com',
    message: 'I placed an order last week (RV-001220) but haven\'t received any shipping updates. Could you please check the status?',
    createdAt: '2024-01-23 10:15',
    isRead: false,
  },
  {
    id: '3',
    name: 'Maryam Ali',
    email: 'maryam.ali@email.com',
    phone: '+971 55 777 6666',
    message: 'Your Royal Abaya Collection is beautiful! Do you have it in burgundy color? I would love to order for my sisters wedding.',
    createdAt: '2024-01-22 16:45',
    isRead: true,
  },
  {
    id: '4',
    name: 'Yusuf Ahmed',
    email: 'yusuf.a@email.com',
    message: 'Great quality products! I wanted to ask about bulk orders for our community event. Do you offer wholesale pricing?',
    createdAt: '2024-01-22 09:20',
    isRead: true,
  },
  {
    id: '5',
    name: 'Layla Hassan',
    email: 'layla.h@email.com',
    phone: '+971 52 444 3333',
    message: 'I received my order today and the Princess Abaya Set is gorgeous! My daughter loves it. Thank you so much for the quick delivery.',
    createdAt: '2024-01-21 11:30',
    isRead: true,
  },
];

const AdminMessages = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m))
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    setSelectedMessage(null);
  };

  const openMessage = (message: Message) => {
    markAsRead(message.id);
    setSelectedMessage(message);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Contact form submissions • {unreadCount} unread
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} New
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Messages List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'p-4 cursor-pointer hover:bg-muted/30 transition-colors',
                !message.isRead && 'bg-primary/5'
              )}
              onClick={() => openMessage(message)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {message.isRead ? (
                    <MailOpen className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Mail className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={cn('font-medium', !message.isRead && 'text-primary')}>
                        {message.name}
                      </span>
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {message.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                  <p className="text-sm mt-1 line-clamp-2">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No messages found</p>
          </div>
        )}
      </div>

      {/* Message Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-6 mt-4">
              {/* Sender Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {selectedMessage.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedMessage.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedMessage.createdAt}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed">{selectedMessage.message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1" asChild>
                  <a href={`mailto:${selectedMessage.email}`}>
                    <Reply className="w-4 h-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => deleteMessage(selectedMessage.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;
