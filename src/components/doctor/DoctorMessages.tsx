
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Message {
  id: string;
  subject: string;
  content: string;
  message_type: string;
  read_at: string | null;
  created_at: string;
  sender: {
    id: string;
    email: string;
  };
  recipient: {
    id: string;
    email: string;
  };
}

export const DoctorMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [composeData, setComposeData] = useState({
    recipient_email: "",
    subject: "",
    content: "",
    message_type: "general"
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          subject,
          content,
          message_type,
          read_at,
          created_at,
          sender:users!messages_sender_id_fkey(id, email),
          recipient:users!messages_recipient_id_fkey(id, email)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Find recipient by email
      const { data: recipientData, error: recipientError } = await supabase
        .from('users')
        .select('id')
        .eq('email', composeData.recipient_email)
        .single();

      if (recipientError || !recipientData) {
        toast({
          title: "Error",
          description: "Recipient not found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientData.id,
          subject: composeData.subject,
          content: composeData.content,
          message_type: composeData.message_type
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      setComposeData({
        recipient_email: "",
        subject: "",
        content: "",
        message_type: "general"
      });
      setShowCompose(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Messages</h2>
        <Button 
          className="healthcare-gradient text-white"
          onClick={() => setShowCompose(!showCompose)}
        >
          <Send className="h-4 w-4 mr-2" />
          Compose Message
        </Button>
      </div>

      {showCompose && (
        <Card>
          <CardHeader>
            <CardTitle>Compose New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <Label htmlFor="recipient_email">Recipient Email</Label>
                <Input
                  id="recipient_email"
                  type="email"
                  value={composeData.recipient_email}
                  onChange={(e) => setComposeData({...composeData, recipient_email: e.target.value})}
                  placeholder="patient@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={composeData.content}
                  onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCompose(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    !message.read_at ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  } ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read_at) {
                      markAsRead(message.id);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{message.subject}</h4>
                      <p className="text-sm text-gray-600">From: {message.sender.email}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(message.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!message.read_at && <Badge variant="default">New</Badge>}
                      <Badge variant="outline">{message.message_type}</Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedMessage ? (
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Message Details
                </div>
              ) : (
                "Select a message to view"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedMessage.subject}</h3>
                  <p className="text-sm text-gray-600">
                    From: {selectedMessage.sender.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    To: {selectedMessage.recipient.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedMessage.created_at), 'MMMM dd, yyyy at HH:mm')}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a message from the inbox to view its content</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
