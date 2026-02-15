import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        message: m.message,
        createdAt: format(new Date(m.created_at), 'yyyy-MM-dd HH:mm'),
        isRead: m.is_read,
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAsRead = async (messageId: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', messageId);
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m))
    );
  };

  const deleteMessage = async (messageId: string) => {
    await supabase.from('contact_messages').delete().eq('id', messageId);
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
